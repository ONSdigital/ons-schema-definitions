# Electronic Questionnaire Runner Response To Downstream

All submitted survey responses and feedback for a collection exercise (a periodic questionnaire within a survey series) are transformed into data formats described below for downstream processing and analysis. Currently, only the v2 downstream data format is supported (See: [Payload Formats][payload_formats]). The format used is derived by the `version` that was provided in the launch JWT token. For more information on launch tokens, see [RM to EQ][rm_to_eq_runner].

The data structures created by EQ Runner (e.g. the answer store) are designed and optimised primarily for the purposes of generic functionality within the Runner application. As a general principle, the extent of the transform carried out by Runner on submitted response data beyond its native data models, as well as on claims received by the launching system, is minimal. It is not the responsibility of Runner to carry out bespoke data transforms. Historically, SDX has been responsible for more extensive and complex data transforms.

The response JSON is encrypted using the public key of the downstream transport mechanism at submission and signed by the Runner private key for downstream verification.

## Rabbit MQ Submitter

When the Runner Rabbit MQ submitter is used, the ciphertext message is published to the designated queue for downstream consumption. Feedback is not supported for Rabbit MQ.

## GCS Submitter

When the Runner GCS submitter is used, an object containing the response ciphertext is written to a bucket for downstream consumption.

- For `surveyresponse` objects, the object ID is named for the response's `tx_id`.
- For `feedback` objects, the object ID is named with a uniquely generated UUID.

The GCS response object contains associated [metadata][gcs_metadata] which can be used in a Pub/Sub messaging strategy for further event driven processes (e.g. receipting and triggering ingestion flow).
Metadata will always contain a `tx_id` and a `case_id`.
Additional receipting metadata may be added, which are defined by `survey_metadata.receipting_keys` from the JTW launch token.

### Example v2 GCS metadata

```json
{
	"tx_id": "6fcf3ddc-a685-4aa1-8fcf-3e38aed5cbf7",
	"case_id": "2859a8b5-34c3-4603-aad9-78198d8341c9",
	"qid": "bdf7dff2-1d73-4b97-bd2d-91f2e53160b9"
}
```

## Low-level data types

- All datetimes are expressed using ISO_8601 and are assumed to be normalised to UTC unless a timezone identifier is given.
- All character encoding is UTF-8.
- All boolean responses are matched to a "True" or "False" string representation.
- Unanswered optional questions are not included in submitted responses (i.e. null or empty strings values are NOT included)

## Payload Formats

The downstream payload format is set using the `version` that was provided in the launch token, currently only v2 is supported. This is not to be confused with runner's `data_version` which is responsible for the structure of the `data` property within the payload.

The v2 payload format is documented below.

2. [EQ Runner to Downstream Payload v2][eq_runner_to_downstream_payload_v2]

## JWT envelope / transport

This payload is part of a JWT, as specified in [JWT Profile][jwt_profile].

[gcs_metadata]: https://cloud.google.com/storage/docs/viewing-editing-metadata "GCS Metadata"
[jwt_profile]: jwt_profile.md "JWT Profile Definition"
[eq_runner_to_downstream_payload_v2]: eq_runner_to_downstream_payload_v2.md "EQ to Downstream Runner Payload v2 Definition"
[rm_to_eq_runner]: respondent_management_to_electronic_questionnaire_runner.md "RM to EQ Runner"
[payload_formats]: electronic_questionnaire_runner_to_downstream#payload-formats "Payload Formats"
