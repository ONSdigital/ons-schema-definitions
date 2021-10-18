Electronic Questionnaire Response
------------------------------------------------
All submitted responses for a collection exercise (a periodic questionnaire within a survey series) are transformed into data format described below for downstream processing and analysis.

The data structures created by Runner (e.g the answer store) are designed and optimised primarily for the purposes of generic functionality within the Runner application. As a general principle, the extent of the transform carried out by Runner on submitted response data beyond its native data models, as well as on claims received by the launching system, is minimal. It is not the responsibility of Runner to carry out bespoke data transforms. Historically SDX has been responsible for more extensive and complex data transforms.

The response JSON is encrypted using the public key of the downstream transport mechanism at submission and signed by the Runner private key for downstream verification.

When the Runner Rabbit MQ submitter is used, the cyphertext message is published to the designated queue for downstream consumption.

When the Runner GCS submitter is used, an object containing the response cyphertext, named for the response `tx_id`, is written to a bucket for downstream consumption. The GCS response object contains associated metadata which can be used in a Pub/Sub messaging strategy for further event driven processes (e.g receipting and triggering ingestion flow).

.. code-block:: javascript

  "metadata": {
    "tx_id": "6fcf3ddc-a685-4aa1-8fcf-3e38aed5cbf7",
    "case_id": "2859a8b5-34c3-4603-aad9-78198d8341c9"
  }

Low-level datatypes
===================
* All datetimes are expressed using ISO_8601 and are assumed to be normalised to UTC unless a timezone identifier is given. All
  character encoding is UTF-8.

* All Boolean responses are matched to a "True" or "False" string representation.

* Unanswered optional questions are not included in submitted responses (i.e null or empty strings values are NOT included)

Schema Definition
=================

  ``tx_id``
    Transaction ID used to trace a transaction through the collection system. This will be a UUID (version 4) and 128-bits in length as defined in RFC 4122 in its textual representation as defined in section 3 "Namespace Registration Template" without the "urn:uuid:" prefix e.g. "f81d4fae-7dec-11d0-a765-00a0c91e6bf6".
  ``type``
    The unique type identifier of this JSON file.
    Can be "uk.gov.ons.edc.eq:surveyresponse" or "uk.gov.ons.edc.eq:feedback"
  ``version``
    The version number of the Runner data payload structure (one of ``0.0.1`` | ``0.0.3``)
  ``origin``
    The name or identifier of the data capture system. Currently "uk.gov.ons.edc.eq" (historicaly named for Electronic Data Collection)
  ``survey_id``
    The survey identifier as used across the ONS (e.g. ``009``)
  ``form_type``
    The type of questionnaire form (e.g. ``0203``)
  ``region_code``
    The Region Code of the questionnaire response. Format as per ISO 3166-2 (https://en.wikipedia.org/wiki/ISO_3166-2:GB) e.g. ``GB-ENG`` | ``GB-WLS`` | ``GB-NIR``
  ``collection``
    An object about the collection exercise the response is for
        ``exercise_sid``
          The Collection exercise UUID (generated in RM)
        ``schema_name``
          The Runner schema representing the question set presented to the respondent
        ``period``
          A string representing the business area's time period for the collection exercise (e.g. "2019" or "JAN2019" or "2019Q3". This is not the start/end dates of a survey.
  ``case_id``
    The case UUID used to identify an instance of a survey response request (generated in RM, may not be included if no case has been linked at launch time)
  ``case_ref``
    The case reference identified by the above UUID (e.g. "1000000000000001")
  ``case_type``
    The type of case (e.g. ``B`` | ``BI``)
  ``started_at``
    The datetime of the first answer saved in a survey
  ``submitted_at``
    The datetime of submission by the respondent
  ``launch_language_code``
    The language code that the questionnaire was launched with (e.g. en | cy | ga | eo)
  ``submission_language_code``
    The language code that was being used on submission (e.g. en | cy | ga | eo)
  ``channel``
    The channel used to launch the electronic questionnaire
  ``flushed``
    Whether the survey was flushed or not. This will be ``true`` if the survey has been flushed through Runner (surveys that haven't been submitted could be flushed through at the end of their collection period) and ``false`` otherwise.
  ``metadata``
    A dictionary of data required for the purposes of rendering or routing the given Runner schema (e.g.)
        ``ru_ref``
          The reporting unit reference responsible for the response id
        ``user_id``
          The id assigned by the respondent management system
        ``display_address``
          The address displayed to the respondent when completing the questionnaire

  ``data`` version 0.0.1
    An object of key, value pairings of answer responses using the business defined q_code as the key for each answer

  ``data`` version 0.0.3
    An object of lists and answers arrays
        ``lists``
          An array of list objects built up during the questionnaire completion

          **list object**

          - ``name``: the name of the list (e.g. ``people-who-live-here``)
          - ``items``: an array of strings of the item identifieres in the list
          - ``primary_person``: [optional] the item identifier of the primary person in the list

        ``answers``
          A sorted array of answer objects

          **answer object**

          - ``value``: the value of the answer(s) provided for the answer_id
          - ``answer_id``: the business defined answer identifier
          - ``list_item_id``: [optional] the ID of the list item the answer was provided for (if answering in the context of a list item)

Example 0.0.1 surveyresponse JSON payloads
=====
.. code-block:: javascript

   {
        "tx_id": "ea82c224-0f80-41cc-b877-8a7804b56c26",
        "type": "uk.gov.ons.edc.eq:surveyresponse",
        "version": "0.0.1",
        "origin": "uk.gov.ons.edc.eq",
        "survey_id": "009",
        "flushed": false,
        "submitted_at": "2019-06-21T16:37:56.551086",
        "launch_language_code": 'en',
        "submission_language_code": 'en',
        "collection": {
            "exercise_sid": "9ced8dc9-f2f3-49f3-95af-2f3ca0b74ee3",
            "schema_name": "mbs_0203",
            "period": "JAN2019"
        },
        "metadata": {
            "user_id": "1234567890",
            "ru_ref": "47850401631S",
            "ref_period_start_date": "2016-05-01",
            "ref_period_end_date": "2016-05-31",
        },
        "started_at": "2019-06-21T16:33:30.665144",
        "case_id": "a386b2de-a615-42c8-a0f4-e274f9eb28ee",
        "case_ref": "1000000000000001",
        "case_type": "B",
        "form_type": "0203",
        "region_code": "GB-ENG",
        "channel": "RAS",
        "data": {
            "001": "2016-01-01",
            "002": "2016-03-30"
        }
    }

Example 0.0.3 surveyresponse JSON payload (inc. data lists and answers)
=====
.. code-block:: javascript

   {
        "tx_id": "ea82c224-0f80-41cc-b877-8a7804b56c26",
        "type": "uk.gov.ons.edc.eq:surveyresponse",
        "version": "0.0.3",
        "origin": "uk.gov.ons.edc.eq",
        "survey_id": "009",
        "flushed": false,
        "submitted_at": "2019-06-21T16:37:56.551086",
        "launch_language_code": 'en',
        "submission_language_code": 'en',
        "collection": {
            "exercise_sid": "9ced8dc9-f2f3-49f3-95af-2f3ca0b74ee3",
            "schema_name": "mbs_0203",
            "period": "JAN2019"
        },
        "metadata": {
            "user_id": "1234567890",
            "ru_ref": "47850401631S",
        },
        "started_at": "2019-06-21T16:33:30.665144",
        "case_id": "a386b2de-a615-42c8-a0f4-e274f9eb28ee",
        "case_ref": "1000000000000001",
        "case_type": "B",
        "form_type": "0203",
        "region_code": "GB-ENG",
        "channel": "RAS",
        "data": {
            "answers": [...],
            "lists": [...]
        }
    }

**lists example**

.. code-block:: javascript

     "lists": [
        {
         "name": "household",
         "primary_person": "AUZvFL",
         "items": ["AUZvFL", "yuRiRs"]
         },
         {
          "name": "visitor",
          "items": ["vgeYGW"]
         }
     ]

**answers example**

.. code-block:: javascript

    "answers": [
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
**answers example (list based relationship type)**

.. code-block:: javascript

    "answers": [
        {
        // example of the list based relationship answser value array
        // based on a mother, father and 2 children
        "answer_id": "relationship-answer",
        "value": [
            {
                // Father's relationship to mother
                "list_item_id": "tkziBG",
                "to_list_item_id": "jBlqGM",
                "relationship": "Husband or Wife"
            },
            {
                // Father's relationship to child 1
                "list_item_id": "tkziBG",
                "to_list_item_id": "CEMVLw",
                "relationship": "Mother or Father"
            },
            {
                // Father's relationship to child 2
                "list_item_id": "tkziBG",
                "to_list_item_id": "uknZxD",
                "relationship": "Mother or Father"
            },
            {
                // Mother's relationship to child 1
                "list_item_id": "jBlqGM",
                "to_list_item_id": "CEMVLw",
                "relationship": "Mother or Father"
            },
            {
                // Mother's relationship to child 2
                "list_item_id": "jBlqGM",
                "to_list_item_id": "uknZxD",
                "relationship": "Mother or Father"
            },
            {
                // Child 1's relationship to child 2
                "list_item_id": "CEMVLw",
                "to_list_item_id": "uknZxD",
                "relationship": "Brother or Sister"
            }
    ]

**answers example (address type)**

.. code-block:: javascript

    "answers": [
        // example of 2 address question answers
        {
        "answer_id": "other-address-uk-answer",
        "value":
            {
                "line1": "20 My Street",
                "line2": "Middleton",
                "town": "Mint Town",
                "postcode": "AB12 CD1",
                "uprn": "722100964321"

            }
        },
        {
        "answer_id": "workplace-address-answer",
        "value":
            {
                "line1": "55 Your Street",
                "line2": "Lowerton",
                "town": "Ice Town",
                "postcode": "XY12 VW1"
            }
        }
    ]

Example 0.0.1 feedback JSON payload
=====

.. code-block:: javascript

    {
        "collection": {
            "exercise_sid": "eedbdf46-adac-49f7-b4c3-2251807381c3",
            "schema_name": "carbon_0007",
            "period": "3003"
        },
        "data": {
                "feedback_text": "Page design feedback",
                "feedback_type": "Page design and structure",
                "feedback_count": 7,
        },
        "metadata": {
            "ref_period_end_date": "2021-03-29",
            "ref_period_start_date": "2021-03-01",
            "ru_ref": "11110000022H",
            "user_id": "d98d78eb-d23a-494d-b67c-e770399de383"
        },
        "origin": "uk.gov.ons.edc.eq",
        "submitted_at": "2021-10-12T10:41:23+00:00",
        "survey_id": "0007",
        "tx_id": "5d4e1a37-ed21-440a-8c4d-3054a124a104",
        "type": "uk.gov.ons.edc.eq:feedback",
        "version": "0.0.1",
        "flushed": false,
        "started_at": "2021-10-12T10:41:23+00:00",
        "case_id": "6453e4d3-aac1-424c-be28-23c57aa9e17d"
    }

JWT envelope / transport
========================
This payload is part of a JWT as specified in :doc:`jwt_profile`.
