Respondent Management to Electronic Questionnaire
-------------------------------------------------

When a respondent is ready to take a survey hosted on the eq system, a set of details
need to be passed to eq to setup the survey correctly. This data is wrapped inside a json web
token which is attached to the end of a url, digitally signed and authorised by a respondent
management system. This creates a clean interface for any respondent management system
to integrate with the eq system.

Schema Definition
=================

Required Fields
---------------

The following metadata keys are always required for the survey runner, they do not appear in individual survey metadata definitions.

``tx_id``
  see :doc:`jwt_profile`
``iat``
  JWT Issued At claim, see https://tools.ietf.org/html/rfc7519#section-4.1.6
``exp``
  JWT Expiration Time claim, see https://tools.ietf.org/html/rfc7519#section-4.1.4
``ru_ref``
  The responding unit reference id - with checkletter appended
``eq_id``
  The eQ questionnaire id
``questionnaire_id``
  The questionnaire id
``collection_exercise_sid``
  A reference number used to represent the collection exercise inside the ONS
``form_type``
  The particular form_type for a responding unit
``ru_ref``
  The responding unit reference id - with checkletter appended.
``ru_name``
  The name of the responding unit. Could be a business name or person name. Not required, however at least one of ``ru_name`` and ``trad_as`` **must** be present
``trad_as``
  Temporary until wider refactor. Not required, however at least one of ``ru_name`` and ``trad_as`` **must** be present
``user_id``
  The id assigned by the respondent management system
``period_id``
  A numerical reference to either a month or quarter time period
``account_service_url``
  The url of the account service (i.e. rrm or ras) used to launch the survey
``response_id``
  A unique identifier for the questionnaire response

Optional Fields
---------------
The runner can optionally accept the following keys.

``case_id``
  The case UUID used to identify a single instance of a survey collection for a respondent
``period_str``
  A display name for the ``period_id`` referenced above
``language_code``
  Language code identifier, used to change language displayed. Format as per ISO-639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) e.g. "en" for English; "cy" for Welsh. This parameter is currently optional; the default is "en"
``survey_url``
  A URL for a remote survey JSON. This claim is used to tell Survey Runner to load the schema JSON from a remote location
``case_ref``
  The case reference identified by the above UUID (e.g. "1000000000000001")
``account_service_log_out_url``
  The logout url of the account service used to launch the survey.  Not required for services that don't have a log in function (i.e., respondent home)

Per Survey Metadata
===================
In addition to the above required fields, some surveys require other data be passed. These can simply have their keys added as a claim in the main JWT body. e.g. ``{"language_code": "en"}``.

An example JSON claim
=====================

.. code-block:: javascript

  {
    "tx_id": "0f534ffc-9442-414c-b39f-a756b4adc6cb",
    "iat": 1458047712,
    "exp": 1458057712,
    "user_id": "64389274239",
    "ru_ref": "7897897J",
    "ru_name": "",
    "eq_id": "678",
    "collection_exercise_sid": "789",
    "period_id": "",
    "period_str": "",
    "ref_p_start_date": "",
    "ref_p_end_date": "",
    "employment_date": "",
    "trad_as": "",
    "form_type": "",
    "return_by": "YYYY-MM-DD",
    "region_code": "GB-GBN",
    "language_code": "en",
    "flag_1": true,
    "roles": [ "role1", "role2" ],
    "response_id": "QzXMrPqoLiyEyerrED88AbkQoQK0sVVX72ZtVphHr0w="
  }


JWT envelope / transport
========================
This payload is part of a JWT as specified in :doc:`jwt_profile`. The encoded
JWT is appended to the URL of the receiving system as follows:

  https://<hostname>/session?token=<JWT>


Flushing responses
========================
To flush responses to the downstream systems a ``/flush`` endpoint is available.
This endpoint takes a JWT in the same way as ``/session`` but with ``roles``
including the role of  ``flusher``
