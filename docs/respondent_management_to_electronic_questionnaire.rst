Census Respondent Home to Census Electronic Questionnaire
---------------------------------------------------------

When a respondent is ready to take a survey hosted on the eq system, a set of details
need to be passed to eq to setup the survey correctly. This data is wrapped inside a json web
token which is attached to the end of a url, digitally signed and authorised by an appropriate
client application. This creates a clean interface for any respondent management system
to integrate with the eq system.

Schema Definition
=================

Census Required Runner Fields
------------------------------

The following metadata keys are always required for the survey runner, they do not appear in individual survey metadata definitions.

``iat``
  JWT Issued At claim, see https://tools.ietf.org/html/rfc7519#section-4.1.6
``exp``
  JWT Expiration Time claim, see https://tools.ietf.org/html/rfc7519#section-4.1.4
``jti``
   A unique identifier for the JWT
``tx_id``
  see :doc:`jwt_profile`
``eq_id``
  The eQ questionnaire schema id (to be removed, hardcoded by RH as census)
``form_type``
  The particular form_type for a responding unit (to be removed, hardcoded by RH as individual_gb_eng)
``response_id``
  A unique identifier for the questionnaire response
``collection_exercise_sid``
  A reference number used to represent the collection exercise inside the ONS
``ru_ref``
  The responding unit reference id (e.g. UPRN)
``user_id``
  The id assigned by the respondent management system (to be removed, hardcoded by RH as 1234567890)
``period_id``
  A numerical reference to either a month or quarter time period (hardcoded by RH as 1)
``case_type``
  The type of Census case (e.g. HH, HI, CE, CI)
``region_code``
  The Region Code of the questionnaire response
``questionnaire_id``
  The Census Questionnaire ID
``account_service_url``
  The url of the account service (i.e. rrm or ras) used to launch the survey


Census Future Requried Fields
-----------------------------
The following metadata keys will be introduced in due course

``survey``
  The survey being launched (e.g census or ccs)
``channel``
  The channel (client) from which the questionnaire was launched

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
``display_address``
  The case's address to be displayed

An example JSON claim
=====================

.. code-block:: javascript

  {
    "tx_id": "0f534ffc-9442-414c-b39f-a756b4adc6cb",
    "iat": 1458047712,
    "exp": 1458057712,
    "user_id": "64389274239",
    "ru_ref": "7897897J",
    "eq_id": "census",
    "collection_exercise_sid": "789",
    "period_id": "1",
    "form_type": "individual_gb_eng",
    "region_code": "GB-ENG",
    "language_code": "en",
    "channel": "rh",
    "response_id": "2420000014903143",
    "questionnaire_id": "2420000014903143",
    "account_service_url": "http://localhost:9092",
    "display_address": "ONS, Segensworth Road",
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
