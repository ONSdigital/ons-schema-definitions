
# Generic launch and receipting pattern

- Start Date: 2022/06/13
- RFC PR: [#68](https://github.com/ONSdigital/ons-schema-definitions/pull/68)

## Overview

A new launch and receipting data definition, making the upstream and downstream data payload format more generic, allowing for easier onboarding of new survey types/response management systems.

## Background & Motivation

Although eQ was used for Census and business surveys, which had a different launch and receipting requirements, they were handled by two separate versions of the application (v2 and v3). Both of these versions concerned themselves with the specific receipting information required for the different downstream services to identify and receipt a response. The current (single) target version of eQ supports the receipt of business survey responses by `case_id`. This first-class attribute will continue to be the primary key by which any given response is identified. However, social surveys require additional identifying data (e.g. questionnaire_id) to receipt the response at a lower level. Social surveys (ad-hoc) can have multiple responses for any given `case_id`. Other survey types (e.g. Health) may also define additional identifying attributes required for receipting. The current launch token and receipting payload definitions are primarily business-specific, making it difficult to onboard new survey types with varying receipting requirements.

## Goals

- RM systems can use multiple survey types with different launch/receipting requirements.
- Allow onboarding RM systems/survey types by eQ Runner with zero or minimal application code change. No non-first-class attributes should be hardcoded in eQ Runner. The payload should specify any additional keys that eQ should use as receipting metadata in addition to the existing `tx_id` and `case_id`.
- Easier change management in SDX: If each system or survey type conformed to a particular specification instead of a very dynamic payload, it simplifies using different convertors/transforms.
- To have a uniform payload specification for launch and submission across survey types and RM systems. The payload specification should define which attributes are first-class and which are survey-specific data.

## Design

Because the new design is a breaking change, it will be referred to as version `v2`. The current format will be known as `v1` and be deprecated. The new launch and downstream payload spec was created to ensure that top-level attributes are consistent across survey types and RM systems. Top-level attributes should be independent of the survey we're running or the RM system we're utilising.

### RM to eQ Runner JWT Payload Format v2

This is an overview of the new launch payload format. Additional information is available in the official document, which may be accessed at [respondent_management_to_electronic_questionnaire_runner.md](../docs/respondent_management_to_electronic_questionnaire_runner.md).

To comply with the format, RM systems must include a `version` property in the JWT payload provided to eQ. This enables eQ to determine the payload's version and apply different validators and parsers. The option of doing this via the existence of specific keys by one survey type or another was avoided to make the version explicit and make future payload versions easier to manage. To avoid modifying the existing payload generators, this new `version` field is unnecessary for the current v1 format. If the property is not present, eQ will fall back to the v1 model. From version 2 onwards, however, this attribute is necessary.

The v2 design removes all top-level properties not shared by all survey types or RM systems from the launch token. The only top-level properties that will be required are:

- iat
- exp
- jti
- account_service_url
- case_id
- collection_exercise_id
- response_id
- tx_id
- version
- either schema_url or schema_name

#### What about additional data about the survey?

RM systems will almost always want to provide extra survey data, such as data that eQ needs to pipe (render) or other metadata that must be passed to downstream systems. This data may contain a mixture of survey specific and respondent specific data.
For example, it may contain data common to all respondents for a given survey and data specific to the respondent filling in the survey. A new property called `survey_metadata` has been introduced to facilitate this. This property is an object with two sub-properties. First, there's the `data` (survey_metadata.data) property, which should contain any additional survey-specific metadata required by eQ or downstream.

For example:

```json  
"survey_metadata": {  
  "data": {  
    "case_ref": "1000000000000001",  
    "case_type": "B",  
    "form_type": "0253",  
    "period_id": "202101",  
    "period_str": "January 2021",  
    "ref_p_end_date": "2021-06-01",  
    "ref_p_start_date": "2021-01-01",  
    "ru_name": "ACME T&T Limited",  
    "ru_ref": "49900000001A",  
    "user_id": "64389274239"  
  }  
}  
```  

The second property is `recepting_keys` (survey_metadata.recepting_keys), an array of key names from the `survey_metadata.data` field that is necessary for receipting. The `recepting_keys` property is optional and is only required for RM systems that require more data in addition to the existing receipting data, which uses 'tx id' and 'case id'. The reason `recepting_keys` is required is to prevent hard-coding the receipting requirements of different survey types in eQ Runner, which means that RM systems can modify these receipting requirements in the future without requiring application changes in Runner. This is not required for business surveys, but RH will require it for social surveys because each `case_id` can have numerous responses. An RH social survey JWT `survey_metadata` payload would resemble something like this:

```json  
"survey_metadata": {  
  "data": {  
    "case_ref": "1000000000000001",  
    "case_type": "B",  
    "questionnaire_id": "bdf7dff2-1d73-4b97-bd2d-91f2e53160b9"  
  },  
  "receipting_keys": [  
    "questionnaire_id"  
  ]  
}  
```  

#### Why does survey_metadata have nested properties?

Something to consider is that `survey_metadata.data` can be `survey_metadata` and `survey_metadata.receipting_keys` could be a top-level key like `receipting_keys`; however, nesting the data made sense because `receipting_keys` must be key names from `survey_metadata.data` and not any other first-class attributes. It may be confusing for it to be top-level as it may be seen as all the keys required for receipting, including first-class properties, and it made more sense than naming it like `survey_metadata_receipting_keys`. However, we can look at this if we want to reduce the level of nesting by one, which would result in something like:

```json  
"receipting_keys": [  
  "questionnaire_id"  
],  
"survey_metadata": {  
  "case_ref": "1000000000000001",  
  "case_type": "B",  
  "questionnaire_id": "bdf7dff2-1d73-4b97-bd2d-91f2e53160b9"  
}  
```  

#### JWT token length

The platform does not have any specifications/limits on the JWT token length apart from any hard limits imposed by browsers. However, it is essential to understand that this new format would result in a slightly larger token length since the data is provided in a nested structure and could be further increased depending on the size of the `receipting_keys` field.

Although modern browsers have support for much larger URL lengths, the platforms still support Internet Explorer, which has a hard limit of 2,048 characters for the URL path. See: `IE URL Limit <https://support.microsoft.com/en-us/topic/maximum-url-length-is-2-083-characters-in-internet-explorer-174e7c8a-6666-f4e0-6fd6-908b53c12246>`_

The platform's goal to support IE is also likely to be dropped in the near future, given as of 15th June 2022, IE 11 has officially reached `end of life <https://docs.microsoft.com/en-us/lifecycle/products/internet-explorer-11>`_. Therefore, this might not be an issue.

### eQ Runner to Downstream Payload Format v2

This is an overview of eQ's new downstream payload format. More information is available in the official document at [electronic_questionnaire_runner_to_downstream.md](../docs/electronic_questionnaire_runner_to_downstream.md).

Because the downstream payload format relies on the JWT payload version used during the survey launch, it has also been modified to accommodate v2. The eQ to downstream v2 design, like the JWT payload v2, removes all top-level properties from the payload that are not shared by all survey types or RM systems. All submissions will have the following mandatory top-level properties:

- tx_id
- type
- data_version
- origin
- collection_exercise_sid
- case_id
- submitted_at
- launch_language_code
- submission_language_code
- flushed
- data
- either schema_url or schema_name

#### What about additional data about the survey?

A new property called `survey_metadata` has been established, similar to the JWT v2 payload, and can be used to provide downstream survey-specific metadata. This property is an object that can hold the key-value pairs of data from the JWT payload's `survey_metadata.data`. This is not to be confused with the `survey_metadata` property itself from the JWT payload. This is because downstream does not require the `receipting_keys` field.  
For example:
```json  
"survey_metadata": {  
  "case_ref": "1000000000000001",  
  "case_type": "B",  
  "form_type": "0253",  
  "period_id": "202101",  
  "period_str": "January 2021",  
  "ref_p_end_date": "2021-06-01",  
  "ref_p_start_date": "2021-01-01",  
  "ru_name": "ACME T&T Limited",  
  "ru_ref": "49900000001A",  
  "user_id": "64389274239"  
}  
```  

However, if we agree that it will always be nested with a single key, this could be a 1-to-1 mapping to the top-level property `survey_metadata` property without the `receipting_keys` field.  
i.e `{ "survey_metadata" : { "data" : {...} } }`

#### How is survey_metadata.receipting_keys used for receipting?

For submissions, the current eQ implementation uses a Google Cloud Storage submitter. This means that an object containing the response ciphertext is written to a bucket for downstream consumption. The GCS response object includes metadata that can be used in a Pub/Sub messaging strategy for additional event-driven activities (e.g. receipting and triggering ingestion flow).

The GCS metadata for both v1 and v2 data formats will always include a `tx_id` and a `case_id`. Additional receipting metadata specified by `survey_metadata.receipting_keys` from the JTW launch token would be included for v2. Example social survey GCS metadata:

> Assuming JWT payload `survey_metadata.receipting_keys` contained only `questionnaire_id`, then the GCS metadata would look like this:

```json  
"metadata": {  
  "tx_id": "6fcf3ddc-a685-4aa1-8fcf-3e38aed5cbf7",  
  "case_id": "2859a8b5-34c3-4603-aad9-78198d8341c9",  
  "questionnaire_id": "bdf7dff2-1d73-4b97-bd2d-91f2e53160b9"  
}  
```  

## Dependencies

This new format would involve updates to RAS, RH, eQ, SDX, and possibly author. Existing systems, such as RAS, do not need to migrate because we are not discontinuing support for v1. They will need to migrate to start making use of the CI registry.

However, this is essential to board RH social surveys. We don't want to add social survey-specific launch and receipting claims to the present pattern because it would be difficult to maintain and verbose.

## Alternatives Considered

### A backwards-compatible change

A backwards-compatible update in which eQ expects additional launch and receipting keys on a conditional basis. The drawback is that, while this may get us beyond RH, the approach isn't optimal because we're combining business/social claims and relying on the hard-coded business logic in the Runner's code to evaluate which claims and downstream data are relevant. If claims are added, modified, or removed, a code change is required since eQ must hard-code claims by survey type into the Runner and handle the logic conditionally. The same is true for new survey type/calling system integration with changing receipting needs.

A generic solution, such as the one presented here, does not require runner changes to add/edit/remove survey-specific claims as they would be provided in the JSON survey schema. Because eQ is solely concerned with first-class attributes common for all survey types, no code modifications are required to integrate a new calling system. As a result, this backward compatible approach was abandoned.

### Leaner data definition

Another leaner data definition was considered, in which eQ is supplied with only the data it requires, and downstream systems communicate with the RM APIs using the identifiers passed by eQ to obtain any further survey metadata they need. This was deemed impractical for the time being due to time constraints and the unlikely prospect of downstream systems directly connecting with the RM APIs. This, however, is something that should be looked into further. The platforms should aim to have RM systems only supply what eQ requires, such as data to render, and eQ passes only the information necessary by downstream systems, such as response data and response identifiers.

## Questions (Resolved)

### Should eQ Runner store or pass data to downstream systems from the JWT payload that have not been explicitly defined?

Historically, eQ has only ever kept JWT payload values that it is aware of as they are hard coded or defined in the schema, and it also has only ever delivered downstream expected properties. For example, if RAS sends eQ a property called `metadata_x`, eQ will ignore it. It is neither saved nor transmitted downstream. We must decide if eQ validates the JWT payload `survey_metadata.data` and only uses keys defined in the schema or whether it passes whatever it receives to the downstream system.

- **Only use keys defined by schema JSON's metadata property**.   
  If we take this approach, eQ Author must ensure that they have a mapping of all the required metadata keys per survey type to build the schema JSON's metadata with those present, which will result in eQ handing those keys down to downstream. Given that the metadata keys are unlikely to change much, this solution is appropriate if we want to be specific about what eQ stores and transmits downstream.

- **Send all data from survey_metadata.data downstream**  
  With this approach, eQ Runner will store all data from `survey_metadata.data` and also pass it downstream, implying that the JWT and `survey_metadata.data` and downstream `survey_metadata` should always be a one-to-one mapping.
  - Should eQ Runner blindly store data from upstream and send it downstream?
  - Given that RM systems must be validated with eQ, is there enough confidence to justify naively storing and transmitting down values from upstream? What about the bad actors...?

#### Decision

The approach for the v2 pattern that eQ will take will be to "**Send all data from survey_metadata.data downstream**".

Reasons for selection:
- The most flexible solution with the fastest turnaround time to onboard new RM systems and new survey types with different receipting requirements.
- Does not require mapping all the survey types and their metadata in eQ Author or eQ Runner Schema Validator.
- The risk of large payloads due to bugs or bad actors in the upstream system is minimal, given eQ Runner's data limit is enforced at the infrastructure level by Google, which means payload can be at most 1 MB at the moment. It is unlikely this would change, and the platform should manage any changes on an as-is basis. If the limit is hit, eQ Runner gracefully handles the error, and there are no adverse effects on other respondents. https://cloud.google.com/datastore/docs/concepts/limits
  - Any move to another Document DB service such as MongoDB, which has a 16 MB limit per document, can be managed on an as-is basis.
- This does not introduce any new vulnerabilities. The existing launch pattern allows for large string values if the browser URL length is not exceeded.
- Downstream systems of eQ Runner should be resilient and protect themselves against large payloads since eQ Runner itself could be the product that contains the bug/bad actor. Therefore, eQ Runner adding artificially high length checks does not mean downstream systems are protected.

---  

### More Info

Additional info can be found in the official docs.

- [**RM to EQ**](../docs/respondent_management_to_electronic_questionnaire_runner.md)
- [**EQ to Downstream**](../docs/electronic_questionnaire_runner_to_downstream.md)  
- [**Example Payloads**](../examples)
