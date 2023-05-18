# RM to EQ Runner: Payload Version 2

This document defines the JWT payload structure for v2.

**Prerequisites:**

- All non JWT specific date time properties are expressed using ISO 8601 and are assumed to be normalised to UTC unless a timezone identifier is given.
- All character encoding is UTF-8

## Schema Definition

### Required Fields

The following metadata properties are always required for the EQ Runner, they do not appear in individual survey metadata definitions.

| **Property**                | **Definition**                                                                                                |
|-----------------------------|---------------------------------------------------------------------------------------------------------------|
| **iat**                     | JWT Issued At claim, see https://tools.ietf.org/html/rfc7519#section-4.1.6                                    |
| **exp**                     | JWT Expiration Time claim, see https://tools.ietf.org/html/rfc7519#section-4.1.4                              |
| **jti**                     | See [JWT Profile][jwt_profile]                                                                                |
| **account_service_url**     | The base URL of the calling service used to launch the survey                                                 |
| **case_id**                 | The case UUID, used to identify a single instance of a survey collection for a respondent                     |
| **collection_exercise_sid** | A reference UUID used to represent the collection exercise inside the ONS                                     |
| **response_id**             | A unique identifier for the questionnaire response                                                            |
| **tx_id**                   | See: [JWT Profile][jwt_profile]                                                                               |
| **version**                 | The version number for this JWT payload specification. For this format, this must be `v2`.                    |
| **response_expires_at**     | An ISO_8601 formatted date-time after which the unsubmitted partial response can be deleted from the database |

#### Schema Selection Fields

The schema selection field determine the mechanism used by EQ Runner to load the questionnaire schema JSON.

The schema used by an EQ Runner can be selected one of two ways.

| **Property**    | **Definition**                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| **schema_url**  | A URL for a remote survey JSON. This claim is used to tell EQ Runner to load the schema JSON from a remote location |
| **schema_name** | The name of the schema to launch. Must be present in [Schemas Repo][schemas_repo]                                   |

### Optional Fields

EQ Runner can optionally accept the following keys.

| **Property**            | **Definition**                                                                                                                                                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **channel**             | The channel (client) from which the questionnaire was launched                                                                                                                                                                                             |
| **language_code**       | Language code identifier, used to change language displayed. Format as per ISO-639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) e.g. "en" for English; "cy" for Welsh. This parameter is currently optional; the default is "en"              |
| **region_code**         | The Region Code of the questionnaire response. Format as per ISO 3166-2 (https://en.wikipedia.org/wiki/ISO_3166-2:GB) i.e. `GB-ENG` / `GB-WLS` / `GB-NIR`. This is used in tactical legacy solutions for Individual Response, Email and Feedback features. |
| **survey_metadata**     | See: [Survey Metadata Fields][survey_metadata_fields]                                                                                                                                                                                                      |

### Survey Metadata Fields

In addition to the above [Required Runner Fields][required_runner_fields], some surveys require other data to be passed to EQ Runner for use within a questionnaire or for it to be sent downstream for receipting purposes. These should be passed via the `survey_metadata` property in the JWT payload.

| **Property**        | **Child Property**  | **Definition**                                                                                                                                                                                   |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **survey_metadata** |                     | An object to hold data about the survey and any additional keys required for receipting.                                                                                                         |
|                     | **receipting_keys** | An optional array of key names from the `survey_metadata.data` spec below that are required for downstream processing. The key names defined here must exist in `survey_metadata.data` property. |
|                     | **data**            | See: [Data Property][survey_metadata_data_property]                                                                                                                                              |

#### Data Property

The `survey_metadata.data` property contains key-value pairs of data about the survey. This data may contain a mixture of survey specific and respondent specific data.
For example, it may contain data common to all respondents for a given survey and data specific to the respondent filling in the survey.
The key values required within this object dependent upon two things:

1. The `survey_metadata.receipting_keys` defined in the JWT payload. EQ Runner will validate that keys specified in this field exists within `survey_metadata.data`.
2. The `metadata` defined in the schema JSON. These are commonly used for piping (rendering) / routing, but can also be used to require additional data in the payload that are sent downstream.
   1. The author of the schema JSON is responsible for marking metadata keys as required and to differentiate between different survey types.
   2. EQ Runner will validate that keys specified in the schema metadata exists within the `survey_metadata.data` field and that it matches the type specified in the JSON schema.

The data property must adhere to one of [Business Survey Metadata][business_survey_metadata] or [Ad-hoc Survey Metadata][adhoc_survey_metadata] specification.

##### Business Survey Metadata

| **Property**         | **Definition**                                                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **case_ref**         | The case reference (e.g. "1000000000000001")                                                                                                                                  |
| **case_type**        | The type of case                                                                                                                                                              |
| **display_address**  | The case's address to be displayed                                                                                                                                            |
| **employment_date**  | The employment reference date                                                                                                                                                 |
| **form_type**        | The particular `form_type` for a responding unit                                                                                                                              |
| **period_id**        | A string representing the business area recognised time period for the collection exercise (e.g. "2019" or "JAN2019" or "2019Q3". This is not the start/end dates of a survey |
| **period_str**       | A display name for the `period_id` referenced above                                                                                                                           |
| **ref_p_start_date** | The reference period's start date                                                                                                                                             |
| **ref_p_end_date**   | The reference period's end date                                                                                                                                               |
| **ru_ref**           | The reporting unit reference                                                                                                                                                  |
| **ru_name**          | The reporting unit’s display name                                                                                                                                             |
| **trad_as**          | The reporting unit's 'trading as' name                                                                                                                                        |
| **user_id**          | The id assigned by the respondent management system                                                                                                                           |
| **survey_id**        | The survey identifier as used across the ONS.                                                                                                                                                                              |

##### Ad-hoc Survey Metadata

| **Property**         | **Definition**                                              |
| -------------------- | ----------------------------------------------------------- |
| **case_ref**         | The case reference (e.g. "1000000000000001")                |
| **qid** | The identifier assigned by the respondent management system |

## An example JSON claim for a Business survey

```json
{
   "exp": 1458057712,
   "iat": 1458047712,
   "jti": "6b383088-b8f8-4167-8847-c4aaeda8fe16",
   "tx_id": "0f534ffc-9442-414c-b39f-a756b4adc6cb",
   "version": "v2",
   "account_service_url": "https://example.com",
   "case_id": "628256cf-5c78-4896-8bec-f0ddb69aaa11",
   "channel": "RAS",
   "collection_exercise_sid": "789",
   "region_code": "GB-WLS",
   "response_expires_at": "2021-07-01T00:00:00+00:00",
   "response_id": "QzXMrPqoLiyEyerrED88AbkQoQK0sVVX72ZtVphHr0w=",
   "schema_name": "mbs_0253",
   "survey_metadata": {
      "data": {
         "case_ref": "1000000000000001",
         "case_type": "B",
         "display_address": "ONS, Government Buildings, Cardiff Rd",
         "employment_date": "2021-03-01",
         "form_type": "0253",
         "period_id": "202101",
         "period_str": "January 2021",
         "ref_p_end_date": "2021-06-01",
         "ref_p_start_date": "2021-01-01",
         "ru_name": "ACME T&T Limited",
         "ru_ref": "49900000001A",
         "trad_as": "ACME LTD.",
         "user_id": "64389274239",
         "survey_id": "345"
      }
   }
}
```

## An example JSON claim for an Ad-hoc survey

```json
{
   "exp": 1458057712,
   "iat": 1458047712,
   "jti": "6b383088-b8f8-4167-8847-c4aaeda8fe16",
   "tx_id": "0f534ffc-9442-414c-b39f-a756b4adc6cb",
   "version": "v2",
   "account_service_url": "https://upstream.example.com",
   "case_id": "628256cf-5c78-4896-8bec-f0ddb69aaa11",
   "channel": "RH",
   "collection_exercise_sid": "789",
   "region_code": "GB-WLS",
   "response_expires_at": "2022-12-01T00:00:00+00:00",
   "response_id": "QzXMrPqoLiyEyerrED88AbkQoQK0sVVX72ZtVphHr0w=",
   "schema_name": "adhoc_0001",
   "survey_metadata": {
      "data": {
         "case_ref": "1000000000000001",
         "qid": "bdf7dff2-1d73-4b97-bd2d-91f2e53160b9"
      },
      "receipting_keys": [
         "qid"
      ]
   }
}
```

[jwt_profile]: jwt_profile.md "JWT Profile Definition"
[schemas_repo]: https://github.com/ONSdigital/eq-questionnaire-schemas/tree/main/schemas "Schemas Repo"
[required_runner_fields]: #required-fields "Required Fields"
[survey_metadata_fields]: #survey-metadata-fields "Survey Metadata Fields"
[survey_metadata_data_property]: #data-property "Survey Metadata Data Property Definition"
[business_survey_metadata]: #business-survey-metadata "Business Survey Metadata"
[adhoc_survey_metadata]: #ad-hoc-survey-metadata "Ad-hoc Survey Metadata"
