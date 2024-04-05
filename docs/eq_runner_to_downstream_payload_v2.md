# EQ Runner to Downstream: Payload Version 2

This document defines the downstream payload structure for version v2.

## Schema Definition

### Required Fields

| **Property**                 | **Definition**                                                                                                                                                                                                                                                                                                              |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **tx_id**                    | Transaction ID used to trace a transaction through the collection system. This will be a UUID (version 4) and 128-bits in length as defined in RFC 4122 in its textual representation as defined in section 3 "Namespace Registration Template" without the "urn:uuid:" prefix e.g. "f81d4fae-7dec-11d0-a765-00a0c91e6bf6". |
| **type**                     | The unique type identifier of this JSON file. `uk.gov.ons.edc.eq:surveyresponse`, `uk.gov.ons.edc.eq:feedback` or `uk.gov.ons.edc.eq:user_research`                                                                                                                                                                         |
| **version**                  | The version number for this payload specification. For this format, this must be `v2`.                                                                                                                                                                                                                                      |
| **data_version**             | The version number of the questionnaire schemas `data_version`. This indicates the data payload convertor that was used. `0.01` or `0.0.3`                                                                                                                                                                                  |
| **origin**                   | The name or identifier of the data capture system. Currently "uk.gov.ons.edc.eq" (historically named for Electronic Data Collection)                                                                                                                                                                                        |
| **collection_exercise_sid**  | A reference UUID used to represent the collection exercise inside the ONS                                                                                                                                                                                                                                                   |
| **case_id**                  | The case UUID used to identify an instance of a survey response request (generated in RM, may not be included if no case has been linked at launch time)                                                                                                                                                                    |
| **submitted_at**             | The datetime of the submitted survey response, feedback or user_research by the respondent                                                                                                                                                                                                                                  |
| **launch_language_code**     | The language code that the questionnaire was launched with (e.g. `en` / `cy` / `ga` / `eo`)                                                                                                                                                                                                                                 |
| **submission_language_code** | The language code that was being used on submission (e.g. `en` / `cy` / `ga` / `eo`). This will not exist if `flushed` is `true`                                                                                                                                                                                            |
| **flushed**                  | Whether the `surveyresponse`, `feedback` or `user_research` was flushed or not. This will be `true` if the `surveyresponse` has been flushed through Runner and `false` otherwise. It is not currently possible for feedback or user_research to be flushed.                                                                |
| **survey_metadata**          | An object that holds metadata about the survey. For allowed values, See: [Submission Survey Metadata][submission_survey_metadata].                                                                                                                                                                                          |
| **data**                     | The response data. See: [EQ Runner Data Versions][eq_runner_data_versions]                                                                                                                                                                                                                                                  |

#### Submission Survey Metadata

- The submission `survey_metadata` will contain all key values from the `survey_metadata.data` property from the launch token. For allowed values, See: [Survey Metadata: Data Property][survey_metadata_data_property].
- It will also include a `survey_id` property which the survey identifier as used across the ONS (e.g. `009`).

#### Schema Selection Fields

In additional to the field above, a schema selection field will be provided which defines the mechanism that was used by EQ Runner to load the questionnaire schema JSON.

One of the following must be present:

| **Property**          | **Definition**                                                                   |
|-----------------------|----------------------------------------------------------------------------------|
| **schema_url**        | The URL to the remote survey JSON.                                             |
| **schema_name**       | The name of the schema launched. Will be present in [Schemas Repo][schemas_repo] |
| **cir_instrument_id** | The UUID of the collection instrument launched from the registry                 |

### Optional Fields

EQ Runner will pass the following keys if a value for them exists.

| **Property**        | **Definition**                                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **region_code**     | The Region Code of the questionnaire response. Format as per ISO 3166-2 () e.g. `GB-ENG` / `GB-WLS` / `GB-NIR`                     |
| **started_at**      | The datetime of the first form submission in the questionnaire.                                                                    |
| **channel**         | The channel used to launch the electronic questionnaire                                                                            |

## Example JSON payload

```json
{
	"tx_id": "ea82c224-0f80-41cc-b877-8a7804b56c26",
	"type": "uk.gov.ons.edc.eq:surveyresponse",
	"version": "v2",
	"data_version": "0.0.1",
	"origin": "uk.gov.ons.edc.eq",
	"flushed": false,
	"submitted_at": "2016-05-21T16:37:56.551086",
	"launch_language_code": "en",
	"submission_language_code": "en",
	"collection_exercise_sid": "9ced8dc9-f2f3-49f3-95af-2f3ca0b74ee3",
	"schema_name": "mbs_0001",
	"started_at": "2016-05-21T16:33:30.665144",
	"case_id": "a386b2de-a615-42c8-a0f4-e274f9eb28ee",
	"region_code": "GB-ENG",
	"channel": "RAS",
	"survey_metadata": {
		"survey_id": "009",
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
		"sds_dataset_id": "c067f6de-6d64-42b1-8b02-431a3486c178"
	},

	// For data version 0.0.1 surveyresponse, both 0.0.1 and 0.0.3 versions of feedback or both 0.0.1 and 0.0.3 versions of user_research
	"data": {
		...
	}

	// For data version 0.0.3 surveyresponse
	"data": {
		"answers": [...]
		"lists": [...],
		"supplementary_data": {...}
	}
}
```

For additional `data` version examples, see [EQ Runner Data Versions][eq_runner_data_versions]

[eq_runner_data_versions]: eq_runner_data_versions.md "EQ Runner Data Versions"
[schemas_repo]: https://github.com/ONSdigital/eq-questionnaire-schemas/tree/main/schemas "Schemas Repo"
[survey_metadata_data_property]: rm_to_eq_runner_payload_v2.md#data-property "Survey Metadata: Data Property"
[submission_survey_metadata]: #submission-survey-metadata "Submission Survey Metadata"
