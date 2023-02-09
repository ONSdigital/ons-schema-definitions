# EQ Runner to Downstream: Payload Version 1 [DEPRECATED]

This document defines the downstream payload structure for version v1.

## Schema Definition

| **Property**                             | **Definition**                                                                                                                                                                                                                                                                                                              |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **tx_id**                                | Transaction ID used to trace a transaction through the collection system. This will be a UUID (version 4) and 128-bits in length as defined in RFC 4122 in its textual representation as defined in section 3 "Namespace Registration Template" without the "urn:uuid:" prefix e.g. "f81d4fae-7dec-11d0-a765-00a0c91e6bf6". |
| **type**                                 | The unique type identifier of this JSON file. `uk.gov.ons.edc.eq:surveyresponse` or `uk.gov.ons.edc.eq:feedback`                                                                                                                                                                                                            |
| **version**                              | The version number of the questionnaire schemas `data_version`. This indicates the data payload convertor that was used. `0.0.1` / `0.0.3`                                                                                                                                                                                  |
| **origin**                               | The name or identifier of the data capture system. Currently "uk.gov.ons.edc.eq" (historically named for Electronic Data Collection)                                                                                                                                                                                        |
| **survey_id**                            | The survey identifier as used across the ONS (e.g. `009`)                                                                                                                                                                                                                                                                   |
| **form_type**                            | The type of questionnaire form (e.g. `0203`)                                                                                                                                                                                                                                                                                |
| **region_code**                          | The Region Code of the questionnaire response. Format as per ISO 3166-2 (https://en.wikipedia.org/wiki/ISO_3166-2:GB) e.g. `GB-ENG` / `GB-WLS` / `GB-NIR`                                                                                                                                                                   |
| **collection**                           | See: [Collection][collection]                                                                                                                                                                                                                                                                                               |
| **metadata**                             | See: [Metadata][metadata]                                                                                                                                                                                                                                                                                                   |
| **case_id**                              | The case UUID used to identify an instance of a survey response request (generated in RM, may not be included if no case has been linked at launch time)                                                                                                                                                                    |
| **case_ref**                             | The case reference identified by the above UUID (e.g. "1000000000000001")                                                                                                                                                                                                                                                   |
| **case_type**                            | The type of case (e.g. `B` / `BI`)                                                                                                                                                                                                                                                                                          |
| **started_at**                           | The datetime of the first answer saved in the survey the response is for                                                                                                                                                                                                                                                    |
| **submitted_at**                         | The datetime of the submitted survey response or feedback by the respondent                                                                                                                                                                                                                                                 |
| **launch_language_code**  [**OPTIONAL**] | The language code that the questionnaire was launched with (e.g. `en` / `cy` / `ga` / `eo`)                                                                                                                                                                                                                                 |
| **submission_language_code**             | The language code that was being used on submission (e.g. `en` / `cy` / `ga` / `eo`). This will not exist if `flushed` is `true`                                                                                                                                                                                            |
| **channel**                              | The channel used to launch the electronic questionnaire                                                                                                                                                                                                                                                                     |
| **flushed**                              | Whether the surveyresponse or feedback was flushed or not. This will be `true` if the surveyresponse has been flushed through Runner and `false` otherwise. It is not currently possible for feedback to be flushed.                                                                                                        |
| **data**                                 | See: [EQ Runner Data Versions][eq_runner_data_versions]                                                                                                                                                                                                                                                                     |

### Collection

The `collection` property is an object about the collection exercise the response is for.

| **Property**                   | **Definition**                                                                                                                                                        |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **exercise_sid**               | The Collection exercise UUID (generated in RM)                                                                                                                        |
| **schema_name**                | The Runner schema representing the question set presented to the respondent                                                                                           |
| **period**                     | A string representing the business area's time period for the collection exercise (e.g. "2019" or "JAN2019" or "2019Q3". This is not the start/end dates of a survey. |
| **instrument_id [DEPRECATED]** | The same value as the top level `form_type` property (required by legacy downstream systems)                                                                          |

### Metadata

The `metadata` property is an object that holds the data required for the purposes of receipting, rendering or routing. This data may contain a mixture of survey specific and respondent specific data.

| **Property**        | **Definition**                                                            |
| ------------------- | ------------------------------------------------------------------------- |
| **ru_ref**          | The reporting unit reference responsible for the response                 |
| **user_id**         | The id assigned by the respondent management system                       |
| **display_address** | The address displayed to the respondent when completing the questionnaire |

> **Note the above metadata properties are not an absolute list of all possible metadata properties.**

## Example JSON payload

```json
{
	"tx_id": "ea82c224-0f80-41cc-b877-8a7804b56c26",
	"type": "uk.gov.ons.edc.eq:surveyresponse",
	"version": "0.0.1",
	"origin": "uk.gov.ons.edc.eq",
	"survey_id": "009",
	"flushed": false,
	"submitted_at": "2016-05-21T16:37:56.551086",
	"launch_language_code": "en",
	"submission_language_code": "en",
	"collection": {
		"exercise_sid": "9ced8dc9-f2f3-49f3-95af-2f3ca0b74ee3",
		"schema_name": "mbs_0203",
		"period": "JAN2019",
		"instrument_id": "0203"
	},
	"metadata": {
		"user_id": "1234567890",
		"ru_ref": "47850401631S",
		"ref_period_start_date": "2016-05-01",
		"ref_period_end_date": "2016-05-31"
	},
	"started_at": "2016-05-21T16:33:30.665144",
	"case_id": "a386b2de-a615-42c8-a0f4-e274f9eb28ee",
	"case_ref": "1000000000000001",
	"case_type": "B",
	"form_type": "0203",
	"region_code": "GB-ENG",
	"channel": "RAS",

	// For data version 0.0.1 surveyresponse or both 0.0.1 and 0.0.3 versions of feedback
	"data": {
		...
	}

	// For data version 0.0.3 surveyresponse
	"data": {
		"answers": [...]
		"lists": [...]
	}
}
```

For additional `data` version examples, see [EQ Runner Data Versions][eq_runner_data_versions]

[collection]: #collection
[metadata]: #metadata
[eq_runner_data_versions]: eq_runner_data_versions.md "EQ Runner Data Versions"
