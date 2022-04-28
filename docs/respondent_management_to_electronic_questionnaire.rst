Respondent Management to Electronic Questionnaire
----------------------------------------------------------------

When a respondent is ready to take a survey hosted on the eq system, a set of details
need to be passed to eq to setup the survey correctly. This data is wrapped inside a json web
token which is attached to the end of a url, digitally signed and authorised by an appropriate
client application. This creates a clean interface for any respondent management system
to integrate with the eq system.

Schema Definition
=================

Required Runner Fields
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
``response_id``
  A unique identifier for the questionnaire response
``case_id``
  The case UUID used to identify a single instance of a survey collection for a respondent
``collection_exercise_sid``
  A reference number used to represent the collection exercise inside the ONS
``ru_ref``
  The reporting unit reference
``user_id``
  The id assigned by the respondent management system
``period_id``
  A string representing the business area recognised time period for the collection exercise (e.g. "2019" or "JAN2019" or "2019Q3". This is not the start/end dates of a survey
``account_service_url``
  The url of the account service used to launch the survey

**Schema Selection Fields**

``schema_name``
  The eQ schema to launch
``form_type``
  The particular form_type for a responding unit
``eq_id``
  The eQ questionnaire id

* if the ``schema_name`` claim is included this will be used to select the specified questionnaire schema to launch
* if the ``schema_name`` claim is omitted both ``eq_id`` AND ``form_type`` must be included to map to the corresponding schema to launch

Optional Runner Fields
----------------------

The runner can optionally accept the following keys.

``survey``
  The survey being launched (deprecated)
``region_code``
  The Region Code of the questionnaire response. Format as per ISO 3166-2 (https://en.wikipedia.org/wiki/ISO_3166-2:GB) i.e. GB-ENG | GB-WLS | GB-NIR. This is used in tactical legacy solutions for Individual Response, Email and Feedback features.
``period_str``
  A display name for the ``period_id`` referenced above
``language_code``
  Language code identifier, used to change language displayed. Format as per ISO-639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) e.g. "en" for English; "cy" for Welsh. This parameter is currently optional; the default is "en"
``schema_url``
  A URL for a remote survey JSON. This claim is used to tell Survey Runner to load the schema JSON from a remote location
``case_ref``
  The case reference identified by the above UUID (e.g. "1000000000000001")
``case_type``
  The type of case
``account_service_log_out_url``
  The logout url of the account service used to launch the survey.  Not required for services that don't have a log in function (i.e., respondent home)
``channel``
  The channel (client) from which the questionnaire was launched
``response_expires_at``
  An ISO_8601 formatted date-time after which the unsubmitted partial response can be deleted from the database

Schema Defined Fields
---------------------

In addition to the above required fields, some surveys require other data to be passed for use within a questionnaire. These can simply have their keys added as a claim in the main JWT body. e.g.

``display_address``
  The case's address to be displayed
``ref_p_start_date``
  The reference period's start date
``ref_p_end_date``
  The reference period's end date

An example JSON claim
=====================

.. code-block:: javascript

  {
    "tx_id": "0f534ffc-9442-414c-b39f-a756b4adc6cb",
    "iat": 1458047712,
    "exp": 1458057712,
    "user_id": "64389274239",
    "ru_ref": "49900000001A",
    "ru_name": "ACME T&T Limited",
    "eq_id": "mbs",
    "collection_exercise_sid": "789",
    "period_id": "202101",
    "period_str": "January 2021",
    "ref_p_start_date": "01-01-2021",
    "ref_p_end_date": "31-12-2021",
    "employment_date": "15-06-2021",
    "display_address": "ONS, Segensworth Road",
    "trad_as": "ACME T&T Limited",
    "form_type": "0253",
    "region_code": "GB-ENG",
    "language_code": "en",
    "schema_name": "mbs_0253",
    "case_type": "B",
    "case_ref": "1000000000000001"
    "response_id": "QzXMrPqoLiyEyerrED88AbkQoQK0sVVX72ZtVphHr0w="
    "response_expires_at": "2021-11-10T14:06:38+00:00"
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
