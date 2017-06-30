Respondent Management to Electronic Questionnaire
-------------------------------------------------

When a respondent is ready to take a survey hosted on the eq system, a set of details
need to be passed to eq to setup the survey correctly. This data is wrapped inside a json web
token which is attached to the end of a url, digitally signed and authorised by a respondent
management system. This creates a clean interface for any respondent management system
to integrate with the eq system.

Schema Definition
=================
  tx_id
    see :doc:`jwt_profile`
  iat
    JWT Issued At claim, see https://tools.ietf.org/html/rfc7519#section-4.1.6
  exp
    JWT Expiration Time claim, see https://tools.ietf.org/html/rfc7519#section-4.1.4
  user_id
    The id assigned by the respondent management system
  ru_ref
    The responding unit reference id - with checkletter appended.
  ru_name
    The name of the responding unit. Could be a business name or person name.
  trad_as
    The trading as name for a responding unit. Temporary until wider refactor.
  eq_id
    The eQ questionnaire instance id.
  collection_exercise_sid
    A reference number used to represent the collection exercise inside the ONS
  period_id
    A numerical reference to either a month or quarter time period
  period_str
    A display name for the period referenced above
  ref_p_start_date
    A start date for the relevant reference period
  ref_p_end_date
    An end date for the relevant reference period
  employment_date
    A specific date for the questionnaire to display to the respondent.
  form_type
    The particular form_type for a responding unit
  return_by
    A date which represents the return date for a particular collection exercise for a survey. Represented by a ISO_8601 YYYY-MM-DD date.
  roles
    An array of roles that this token is allowed to assume. This parameter is currently optional, EQ will still work if it is not passed.
  region_code
    Region code identifier, used to change content for different regions. Format ISO 3166-1 alpha-2 (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) e.g. GB-GBN. This parameter is currently optional, EQ will still work if it is not passed
  language_code
    Language code identifier, used to change language displayed. Format as per ISO-639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) e.g. "en" for English; "cy" for Welsh. This parameter is currently optional; the default is "en".
  variant_flags
    JSON object containing name:value pairs describing variations in the questionnaire e.g. `{"flag_1": true, "flag_2": false}`. The only value type allowed is boolean i.e. `true` or `false`.

* All dates are represented in ISO_8601 and are assumed to be UTC unless a timezone element is supplied.
* All elements not indicated as optional are required as part of the claim.



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
    "variant_flags": {
      "flag_1": true,
      "flag_2": false
    },
    "roles": [ "role1", "role2" ]
  }


JWT envelope / transport
========================
This payload is part of a JWT as specified in :doc:`jwt_profile`. The encoded
JWT is appended to the URL of the receiving system as follows:

  https://<hostname>/session?token=<JWT>
