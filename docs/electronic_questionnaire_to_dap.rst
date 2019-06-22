Electronic Questionnaire to DAP
------------------------------------------------
All submitted responses for a collection exercise (a questionnaire within a survey series) are transformed into
the following described data format for downstream processing and analysis. The json document is encrypted using the
public key of the downstream transport mechanimn at submission, placing the cyphertext onto message queue for downstream consumption

Low-level datatypes
===================
* All datetimes are expressed using ISO_8601 and are assumed to be normalised to UTC unless a timezone identifier is given. All
  character encoding is UTF-8.

* All Boolean responses are matched to a "True" or "False" string representation.

* Uanswered optional questions will not be included in submitted responses (i.e null or empty strings values are NOT included)


Schema Definition
=================

  tx_id
     Transaction ID used to trace a transaction through the whole system. This will be a GUID (version 4) and 128-bits in length as defined in RFC 4122 in its textual representation as defined in section 3 "Namespace Registration Template" without the "urn:uuid:" prefix e.g. "f81d4fae-7dec-11d0-a765-00a0c91e6bf6".
  type
    The unique type identifier of this JSON file.
    Can be "uk.gov.ons.edc.eq:surveyresponse" or "uk.gov.ons.edc.eq:feedback"
  version
    The version number of the schema definition used to generate and parse the
    schema. Will always be 3 numbers separated by two dots e.g. "0.0.3" with the
    intention being MAJOR.MINOR.PATCH no guarantees are given to compatibility
    across version changes.
  origin
    The name or identifier of the data capture / data generator system. Currently "uk.gov.ons.edc.eq" - however this allows us to
    futureproof for new collection instruments.
  survey_id
    The numerical survey identifier as used across the ONS.
  case_id
    The case UUID used to identify a single instance of a survey collection for a respondent [optional]
  flushed
    Whether the survey was flushed or not. This will be `true` if the survey has been flushed through EQ (surveys that haven't been submitted could be flushed through at the end of their collection period) and `false` otherwise.
  collection
    exercise_sid
      Collection exercise ID
    instrument_id (replace with eq_schema/eq_schema_id for ceneus and beyond !!!)
      The collection instrument ID - used by legacy downstream systems (contains the form_type!)
    period_id (rename from period and move to required runner metadata.. include or not for ceneus ??????)
      A string representing the collection period
  questionnaire_id
    A string containing the census Questionnaire ID
  response_id
    A string contining the RH response_id (not required ?)
  started_at
    The datetime of the first answer saved in a survey
  submitted_at
    The datetime of submission by the respondent.
  metadata
    user_id
      The respondent user_id as specified by the channel in use (this will be the identifier of the staff operator)
    ru_ref
      Reporting Unit reference number to which the collected data represents. This
      allows the downstream system to map the responses to individual business/household/person
      in the original sample as created by the survey team.
  lists
      An array of lists objects built up during the survey completion

        **list object**

        - name: the name of the list (e.g. people-who-live-here)
        - context: a dictionary of associated information about given items in the list (e.g. primary-person)
        - items: an array of the item identifieres in the list

        **lists example**

         .. code-block:: javascript

            "lists": [
                {
                 "name": "people-who-live-here",
                 "context": {"primary_person": "AUZvFL"},
                 "items": ["AUZvFL", "yuRiRs"]
                 },
                 {
                  "name": "visitors",
                  "items": ["vgeYGW"]
                 }
            ]


  data
    Version 0.0.3
        A sorted array of answers in the order the questionnaire was answered* [Is this correct???????????????].

        **Dictionary of values**

        - value: The answer given in the questionnaire for the answer.
        - answer_id: The identifier of the answer.

        **Version 0.0.3 data example**

        .. code-block:: javascript

            "data": [
                {
                  // Example of a free text input box question
                  "value": "piloting space shuttles",
                  "answer_id": "job-description-answer",
                },
                {
                  // Example of a single value for a radio button question
                  "answer_id": "marriage-type-answer",
                  "value": "Married"
                },
                {
                  // Example of multiple values for a checkbox question
                  "value": ["Eggs", "Bacon", "Spam"],
                  "answer_id": "favourite-breakfast-food",
                }
                {
                  "answer_id": "first-name",
                  "value": "Colin",
                  "list_item_id": "AUZvFL"
                },
                {
                  "answer_id": "last-name",
                  "value": "Cat",
                  "list_item_id": "AUZvFL"
                },
                {
                  "answer_id": "first-name",
                  "value": "Dave",
                  "list_item_id": "yuRiRs"
                },
                {
                  "answer_id": "last-name",
                  "value": "Dog",
                  "list_item_id": "yuRiRs"
                },
            ]




Example Json payloads
=====================

.. code-block:: javascript

   {
        "tx_id": "ea82c224-0f80-41cc-b877-8a7804b56c26",
        "type": "uk.gov.ons.edc.eq:surveyresponse",
        "version": "0.0.3",
        "origin": "uk.gov.ons.edc.eq",
        "survey_id": "census",
        "flushed": false,
        "submitted_at": "2019-06-21T16:37:56.551086",
        "collection": {
            "exercise_sid": "9ced8dc9-f2f3-49f3-95af-2f3ca0b74ee3",
            "eq_schema": "census_individual_gb_eng.json",
            "period_id": "2019"
        },
        "metadata": {
            "user_id": "1234567890",
            "ru_ref": "47850401631S"
        },
        "response_id": "2111319119395635",
        "questionnaire_id": "4012828663560993",
        "started_at": "2019-06-21T16:33:30.665144",
        "case_id": "a386b2de-a615-42c8-a0f4-e274f9eb28ee",
        "data": [...]
        "lists": [...]
    }
    

JWT envelope / transport
========================
This payload is part of a JWT as specified in :doc:`jwt_profile`.
