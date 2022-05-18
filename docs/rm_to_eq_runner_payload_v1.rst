RM to EQ Runner: Payload Version 1
==================================

This document defines the JWT payload structure for version 1. This is the format used, if the ``version`` property
was not provided in the launch token.

Prerequisites:
  * All non JWT specific date time properties are expressed using ISO 8601 and are assumed to be normalised to UTC unless a timezone identifier is given.
  * All character encoding is UTF-8

Schema Definition
*****************

Required Runner Fields
----------------------

The following metadata properties are always required by eQ Runner, they do not appear in individual survey metadata definitions.

``iat``
  JWT Issued At claim, see https://tools.ietf.org/html/rfc7519#section-4.1.6
``exp``
  JWT Expiration Time claim, see https://tools.ietf.org/html/rfc7519#section-4.1.4
``jti``
   A unique identifier for the JWT
``tx_id``
  see :doc:`jwt_profile`
``account_service_url``
  The URL of the account service used to launch the survey
``case_id``
  The case UUID, used to identify a single instance of a survey collection for a respondent
``collection_exercise_sid``
  A reference UUID used to represent the collection exercise inside the ONS
``period_id``
  A string representing the business area recognised time period for the collection exercise (e.g. "2019" or "JAN2019" or "2019Q3". This is not the start/end dates of a survey
``response_id``
  A unique identifier for the questionnaire response
``ru_ref``
  The reporting unit reference - with check letter appended.
``user_id``
  The identifier assigned by the respondent management system

Schema Selection Fields
^^^^^^^^^^^^^^^^^^^^^^^

The schema selection fields determine the mechanism used by eQ Runner to load the questionnaire schema JSON.

``eq_id``
  The eQ questionnaire ID
``form_type``
  The particular form_type for a responding unit
``schema_name``
 The name of the schema.

The schema used by an eQ Runner can be selected one of two ways.

In priority order:

#. ``schema_name``
     The name of the schema to launch. Must be present in https://github.com/ONSdigital/eq-questionnaire-schemas/tree/main/schemas

#. ``eq_id`` with ``form_type``
     This is only used for schema selection if ``schema_name`` is omitted from the claims. Mapped as ``<eq_id>_<form_type>`` for schema selection purposes. Must be present in https://github.com/ONSdigital/eq-questionnaire-schemas/tree/main/schemas

Optional Runner Fields
----------------------

eQ Runner can optionally accept the following properties.

``account_service_log_out_url``
  The logout url of the account service used to launch the survey.  Not required for services that don't have a log in function (i.e., respondent home)
``channel``
  The channel (client) from which the questionnaire was launched
``case_ref``
  The case reference (e.g. "1000000000000001")
``case_type``
  The type of case
``language_code``
  Language code identifier, used to change language displayed. Format as per ISO-639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) e.g. "en" for English; "cy" for Welsh. This parameter is currently optional; the default is "en"
``period_str``
  A display name for the ``period_id`` referenced above
``region_code``
  The Region Code of the questionnaire response. Format as per ISO 3166-2 (https://en.wikipedia.org/wiki/ISO_3166-2:GB) i.e. GB-ENG | GB-WLS | GB-NIR. This is used in tactical legacy solutions for Individual Response, Email and Feedback features.
``response_expires_at``
  An ISO 8601 formatted date time, after which the unsubmitted partial response can be deleted from the database
``survey``
  The survey being launched (deprecated)

Schema Defined Fields
---------------------

In addition to the above required fields, some surveys require other data to be passed for use within a questionnaire. These can simply have their keys added as a claim in the main JWT body. e.g.

``display_address``
  The case's address to be displayed
``employment_date``
  The employment reference date
``ref_p_end_date``
  The reference period's end date
``ref_p_start_date``
  The reference period's start date
``ru_name``
  The reporting unit's display name
``trad_as``
  The reporting unit's 'trading as' name

An example JSON claim
*********************

.. code-block:: json

  {
    "exp": 1458057712,
    "iat": 1458047712,
    "jti": "6a591d32-6a28-4f7d-85c7-27215cc90705",
    "tx_id": "0f534ffc-9442-414c-b39f-a756b4adc6cb",
    "account_service_url": "https://upstream.example.com",
    "case_id": "628256cf-5c78-4896-8bec-f0ddb69aaa11",
    "case_ref": "1000000000000001",
    "case_type": "B",
    "collection_exercise_sid": "789",
    "display_address": "ONS, Segensworth Road",
    "employment_date": "2021-02-01",
    "eq_id": "mbs",
    "form_type": "0253",
    "language_code": "en",
    "period_id": "202101",
    "period_str": "January 2021",
    "ref_p_end_date": "2021-03-01",
    "ref_p_start_date": "2021-01-01",
    "region_code": "GB-ENG",
    "response_expires_at": "2021-11-10T14:06:38+00:00",
    "response_id": "QzXMrPqoLiyEyerrED88AbkQoQK0sVVX72ZtVphHr0w=",
    "ru_name": "ACME T&T Limited",
    "ru_ref": "49900000001A",
    "schema_name": "mbs_0253",
    "trad_as": "ACME T&T Limited",
    "user_id": "64389274239"
  }
