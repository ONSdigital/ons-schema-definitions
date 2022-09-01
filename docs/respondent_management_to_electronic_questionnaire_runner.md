# Respondent Management (RM) to EQ Runner (EQ)

When a respondent is ready to take a survey hosted on EQ Runner, a set of details need to be passed to EQ Runner to set up the survey correctly.
This data is wrapped inside a JSON Web Token (JWT) which is attached to the end of a URL, digitally signed and authorised by an appropriate client application.
This creates a clean interface for any respondent management system to integrate with the EQ Runner.

## JWT payload

The structure of the JWT payload that the RM system uses can be defined in two ways, version 1 (v1) **[DEPRECATED]** and 2 (v2).
The latest and the recommended version for launching EQ Runner is v2.
From v2, the JWT payload is required to define a `version` property with the associated version. To ensure backwards compatibility, the absence of this property indicates the token is v1.
Depending on the value defined by the `version` property, the downstream data will also be structured in 2 different ways.
For information regarding downstream data formats, see [EQ Runner to Downstream][eq_runner_to_downstream].

- [RM to EQ Runner Payload v1][rm_to_eq_runner_payload_v1] **[DEPRECATED]**
- [RM to EQ Runner Payload v2][rm_to_eq_runner_payload_v2]

## JWT envelope / transport

This payload is part of a JWT, as specified in [JWT Profile][jwt_profile]. The encoded
JWT is appended to the URL of the receiving system as follows:

`https://<hostname>/session?token=<JWT>`

## Flushing responses

To flush responses to the downstream systems, a `/flush` endpoint is available.
This endpoint takes a JWT in the same way as `/session` but with `roles` including the role of `flusher`.

[jwt_profile]: jwt_profile.md "JWT Profile Definition"
[eq_runner_to_downstream]: electronic_questionnaire_runner_to_downstream.md "Electronic Questionnaire Runner to Downstream Definition"
[rm_to_eq_runner_payload_v1]: rm_to_eq_runner_payload_v1.md "RM to EQ Runner Payload v1 Definition"
[rm_to_eq_runner_payload_v2]: rm_to_eq_runner_payload_v2.md "RM to EQ Runner Payload v2 Definition"
