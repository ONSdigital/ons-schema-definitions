Electronic Questionnaire to Survey Data Exchange
------------------------------------------------
All collected responses for a collection exercise (a questionnaire within a survey series) are transformed into
the following described data format for downstream processing and refinement. The json document is encrypted using the
public key of the downstream collection system at submission, placing the cyphertext onto a rabbitmq queue for consumption
by eq-submitter component.

Low-level datatypes
===================
* All datetimes are expressed using ISO_8601 and are assumed to be normalised to UTC unless a timezone identifier is given. All
  character encoding is UTF-8.

* All Boolean responses are matched to a "True" or "False" string representation.

* The ru_ref is appended by default with a check letter for all responses.

* If a question has no answer and is optional, we will not give an null
  or empty string entry for the downstream system.


Schema Definition
=================
  tx_id
     Transaction ID used to trace a transaction through the whole system. This will be a GUID (version 4) and 128-bits in length as defined in RFC 4122 in its textual representation as defined in section 3 "Namespace Registration Template" without the "urn:uuid:" prefix e.g. "f81d4fae-7dec-11d0-a765-00a0c91e6bf6".
  type
    The unique type identifier of this JSON file.
    Can be "uk.gov.ons.edc.eq:surveyresponse" or "uk.gov.ons.edc.eq:feedback"
  version
    The version number of the schema definition used to generate and parse the
    schema. Will always be 3 numbers separated by two dots e.g. "10.2.33" with the
    intention being MAJOR.MINOR.PATCH no guarantees are given to compatibility
    across version changes.
  origin
    The name or identifier of the data capture / data generator system. Currently,
    the only option for this is "uk.gov.ons.edc.eq" - however this allows us to
    futureproof for new collection instruments.
  survey_id
    The numerical survey number as used across the ONS.
  case_id
    The case UUID used to identify a single instance of a survey collection for a respondent [optional]
  case_ref
    The case reference identified by the above UUID (e.g. "1000000000000001") [optional]
  flushed
    Whether the survey was flushed or not. This will be `true` if the survey has been flushed through EQ (surveys that haven't been submitted could be flushed through at the end of their collection period) and `false` otherwise.
  collection
    exercise_sid
      Collection exercise ID
    instrument_id
      The collection instrument ID - used by legacy downstream systems. Referenced by some systems
      as the form_type.
    period
      The collection period, currently represented as a string due to downstream systems lack of support for correct date formats.

  started_at
    The datetime of the first answer saved in a survey
  submitted_at
    The datetime of submission by the respondent.
  metadata
    user_id
      The respondent user_id as specified by the respondent management system in use.
    ru_ref
      Reporting Unit reference number to which the collected data represents. This
      allows the downstream system to map the responses to individual business/household/person
      in the original sample as created by the survey team.
  data
    Version 0.0.1
        A key, value pairing of responses from a respondent, making use of the box_code / stat_var / q_code as the key to identify the captured respondence from a user.

        **Version 0.0.1 data example**

        .. code-block:: javascript

            {
              "001": "2016-01-01",
              "002": "2016-03-30"
            }

    Version 0.0.2
        A sorted array of answers in the order the questionnaire was answered.

        **Dictionary of values**

        - value: The answer given in the questionnaire for the answer.
        - answer_id: The identifier of the answer.
        - group_instance: The sub-identifier of a group of block_id/pages if that group repeats.
        - answer_instance: The sub-identifier of an answer if that answer repeats.

        **Version 0.0.2 data example**

        .. code-block:: javascript

            [{
                "value": "Joe",
                "answer_id": "household-first-name",
                "group_instance": 0,
                "answer_instance": 0
            },
            {
                // Example of multiple values for a checkbox question
                "value": ["Eggs", "Bacon", "Spam"],
                "answer_id": "favourite-breakfast-food",
                "group_instance": 0,
                "answer_instance": 0
            }]



Example Json payloads
=====================

.. code-block:: javascript

    {
      "tx_id": "0f534ffc-9442-414c-b39f-a756b4adc6cb",
      "type" : "uk.gov.ons.edc.eq:surveyresponse",
      "version" : "0.0.1",
      "origin" : "uk.gov.ons.edc.eq",
      "survey_id": "021",
      "flushed": false,
      "collection":{
        "exercise_sid": "hfjdskf",
        "instrument_id": "yui789",
        "period": "2016-02-01"
      },
      "started_at": "2016-03-06T14:10:08Z",
      "submitted_at": "2016-03-07T15:28:05Z",
      "metadata": {
        "user_id": "789473423",
        "ru_ref": "432423423423"
      },
      "data": [{
        "value": "Joe",
        "answer_id": "household-first-name",
        "group_instance": 0,
        "answer_instance": 0
      },
      {
        "value": ["Eggs", "Bacon", "Spam"],
        "answer_id": "favourite-breakfast-food",
        "group_instance": 0,
        "answer_instance": 0
      }]
    }
    
.. code-block:: javascript

    {
      "type" : "uk.gov.ons.edc.eq:feedback",
      "origin" : "uk.gov.ons.edc.eq",
      "metadata": {
        "user_id": "789473423",
        "ru_ref": "432423423423"
      },
      "data": {
        "url": "https://eq.onsdigital.uk/feedback",
        "name": "John Appleseed",
        "email": "john.appleseed@ons.gov.uk",
        "message": "Feedback message string"
      },
      "started_at": "2016-03-07T14:00:59Z",
      "submitted_at": "2016-03-07T15:28:05Z",
      "collection": {
        "instrument_id": "0001",
        "exercise_sid": "739",
        "period": "2016-02-01"
      },
      "survey_id": "021",
      "tx_id": "0f534ffc-9442-414c-b39f-a756b4adc6cb",
      "version" : "0.0.1"
    }

JWT envelope / transport
========================
This payload is part of a JWT as specified in :doc:`jwt_profile`.
