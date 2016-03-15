Respondent survey session schema
--------------------------------

When a respondent is ready to take a survey hosted on the eq system, a set of details
need to be passed to eq to setup the survey correctly. This data is wrapped inside a json web
token which is attached to the end of a url, digitally signed and authorised by a respondent
management system. This creates a clean interface for any respondent management system
to integrate with the eq system.

Schema definition
  user_id
    The id assigned by the respondent management system
  ru_ref
    The responding unit reference id.
  ru_name
    The name of the responding unit. Could be a business name or person name.
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
  form_type
    The particular form_type for a responding unit
  complete_by
    A date which represents the closing date for a particular collection exercise for a survey. Represented by a ISO_8601 date.
  iat
    JWT Issued at timestamp (UNIX timestamp format) part of the JWT standard
  exp
    Expiry timestamp (UNIX timestamp format) for the JWT, part of the standard

* All dates are represented in ISO_8601 and are assumed to be UTC unless a timezone element is supplied.
* All elements are required as part of the claim.



An example JSON claim
=====================

.. code-block:: javascript

  {
    "user_id": "64389274239",
    "ru_ref": "7897897",
    "ru_name": "",
    "eq_id": "678",
    "collection_exercise_sid": "789",
    "period_id": "",
    "period_str": "",
    "ref_p_start_date": "",
    "ref_p_end_date": "",
    "form_type": "",
    "iat":"1458047712",
    "exp":"1458057712"
  }


JWT envelope / transport
========================

Each respondent session is encrypted and wrapped as a `json web token (JWT) <http://jwt.io/>`_ (RFC 7519) which
is then appended to a url, issued via a http 302 redirect over ssl.

The two relevant claims, `iat` & `exp` are included in our payload and given in the example above.

URL schema
==========

  https://<hostname>/session?token=<JWT>

Where hostname is eq.edc.ons.gov.uk in production and preprod-surveys.eq.ons.digital in preprod.
