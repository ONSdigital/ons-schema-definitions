Electronic Questionnaire v3 to DAP
------------------------------------------------
All submitted responses for a collection exercise (a questionnaire within a survey series) are transformed into the following described data format for downstream processing and analysis.

The data structures created by eQ (e.g the answer store) are designed and optimised primarily for the purposes of generic functionality within the survey runner product. As a general principle, the extent of the transform carried out by eQ on submitted response data beyond its native data models is minimal. It is not the responsibility of the eQ product to carry out bespoke data transforms. Historically SDX has been responsible for more extensive and complex data transforms.

The json document is encrypted using the public key of the downstream transport mechanism at submission, placing the cyphertext onto a message queue for downstream consumption.

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
    The version number of the eQ data payload structure (e.g. "0.0.3")
  ``origin``
    The name or identifier of the data capture system. Currently "uk.gov.ons.edc.eq" (historical named for Electronic Data Collection)
  ``survey_id``
    The numerical survey identifier as used across the ONS
  ``case_id``
    The case UUID used to identify an instance of a survey response request (generated in RM, may not be included if no case has been linked at launch time)
  ``flushed``
    Whether the survey was flushed or not. This will be `true` if the survey has been flushed through eQ (surveys that haven't been submitted could be flushed through at the end of their collection period) and `false` otherwise.
  ``collection``
    A dictionary of data about the collction exercise the response is for

        ``exercise_sid``
          The Collection exercise UUID (generated in RM)
        ``schema_name``
          The eQ schema representing the question set presented to the respondent
        ``period``
          A string representing the business area's time period for the collection exercise (e.g. "2019" or "JAN2019" or "2019Q3". This is not the start/end dates of a survey (currently hardcoded by RH as 1, to be changed to "2019")
  ``started_at``
    The datetime of the first answer saved in a survey
  ``submitted_at``
    The datetime of submission by the respondent
  ``launch_language_code``
    The language code that the questionnaire was launched with (e.g. en | cy | ga | eo)
  ``submission_language_code``
    The language code that was being used on submission (e.g. en | cy | ga | eo)
  ``case_type``
    The type of case (e.g. B | BI)
  ``form_type``
    The type of questionnaire form
  ``region_code``
    The Region Code of the questionnaire response. Format as per ISO 3166-2 (https://en.wikipedia.org/wiki/ISO_3166-2:GB) i.e. GB-ENG | GB-WLS | GB-NIR
  ``channel``
    The channel used to launch the electronic questionnaire
  ``metadata``
    A dictionary of data required for the purposes of rendering or routing the given eQ schema (e.g.)
        ``ru_ref``
          The reporting unit reference responsible for the response id
        ``user_id``
          The id assigned by the respondent management system
        ``display_address``
          The address displayed to the respondent when completing the questionnaire

  ``data`` version 0.0.3
    An object containing the response's lists and answers

        ``lists``
          An array of list objects built up during the questionnaire completion

          **list object**

          - ``name``: the name of the list (e.g. people-who-live-here)
          - ``items``: an array of strings of the item identifieres in the list
          - ``primary_person``: [optional] the item identifier of the primary person in the list

        ``answers``
          A sorted array of answer objects

          **answer object**

          - ``value``: the value of the answer(s) provided for the answer_id
          - ``answer_id``: the identifier of the answer.
          - ``list_item_id``: [optional] the ID of the list item the answer was provided for (if answering in the context of a list item)




Example Json payloads
=====================
.. code-block:: javascript

   {
        "tx_id": "ea82c224-0f80-41cc-b877-8a7804b56c26",
        "type": "uk.gov.ons.edc.eq:surveyresponse",
        "version": "0.0.3",
        "origin": "uk.gov.ons.edc.eq",
        "survey_id": "",
        "flushed": false,
        "submitted_at": "2019-06-21T16:37:56.551086",
        "launch_language_code": 'en',
        "submission_language_code": 'en',
        "collection": {
            "exercise_sid": "9ced8dc9-f2f3-49f3-95af-2f3ca0b74ee3",
            "schema_name": "mbs_0201",
            "period": "JAN2019"
        },
        "metadata": {
            "user_id": "1234567890",
            "ru_ref": "47850401631S",
        },
        "response_id": "2111319119395635",
        "started_at": "2019-06-21T16:33:30.665144",
        "case_id": "a386b2de-a615-42c8-a0f4-e274f9eb28ee",
        "case_type": "",
        "form_type": "H",
        "region_code": "GB-ENG",
        "channel": "RAS",
        "data": {
            answers: [...],
            lists: [...]
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


JWT envelope / transport
========================
This payload is part of a JWT as specified in :doc:`jwt_profile`.
