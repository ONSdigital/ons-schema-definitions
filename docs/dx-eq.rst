EQ downstream data format for Data exchange
===========================================


All collected responses for a collection exercise (a questionnaire within a survey series) are transformed into
the following described data format for downstream processing and refinement. The json document is encrypted using the
public key of the downstream collection system at submission, placing the cyphertext onto a rabbitmq queue for consumption
by eq-submitter component.


Low-level datatypes
-------------------
* All datetimes are expressed using ISO_8601 and are assumed to be normalised to UTC unless a timezone identifier is given. All
  character encoding is UTF-8.

* All Boolean responses are matched to a "True" or "False" string representation.

* The ru_ref is appended by default with a check letter for all responses.

* If a question has no answer and is optional, we will not give an null
  or empty string entry for the downstream system.


Schema definition

  survey_id
    The numerical survey number as used across the ONS.
  collection
    exercise_sid
      Collection exercise ID
    instrument_id
      The collection instrument ID - used by legacy downstream systems. Referenced by some systems
      as the form_type.
    period
      The collection period date in ISO 8601
  version
    The version number of the schema definition used to generate and parse the
    schema.
  origin
    The name or identifier of the data capture / data generator system. Currently,
    the only option for this is "eq" - however this allows us to futureproof for
    new collection instruments.
  submitted_at
    The datetime of submission by the respondent.
  metadata
    user_id
      The respondent user_id as specified by the respondent management system in use.
    ru_ref
      Respondent unit reference number to which the collected data represents. This
      allows the downstream system to map the responses to individual business/household/person
      in the original sample as created by the survey team.
  paradata
    Placeholder block for possible paradata measures.
  data
    A key, value pairing of responses from a respondent, making use of the box_code / stat_var / q_code as the
    key to identify the captured respondence from a user.




Example Json payload
--------------------


.. code-block:: javascript

    {
      "survey_id": "021",
      "type" : "uk.gov.ons.edc.eq:surveyresponse",
      "version" : "0.0.1",
      "origin" : "uk.gov.ons.edc.eq"
      "collection":{
        "exercise_sid": "hfjdskf",
        "instrument_id": "yui789",
        "period": "2016-02-01"
      },
      "submitted_at": "2016-03-07T15:28:05Z",
      "metadata": {
        "user_id": "789473423",
        "ru_ref": "432423423423"
      },
      "paradata": {},
      "data": {
        "001": "2016-01-01",
        "002": "2016-03-30"
      }
    }
