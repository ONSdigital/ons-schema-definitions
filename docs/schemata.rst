Questionnaire Schemata
=====================

This schemata describes the structure and content of eq questionnaires, as accepted by the eq-author and eq-survey-runner. A questionnaire is asked as part of a survey.

Broadly, questionnaires are structured as groups of blocks. Blocks contain sections, which contain questions. Each question has at least one answer with a number of possible options. 


The top level questionnaire element describes metadata around the questionnaire.

.. code-block:: javascript

  {
    mime_type: "application/json/ons/eq",
    questionnaire_id: "0",
    schema_version: "0.0.1",
    survey_id: "0",
    title: "Star Wars",
    theme: "starwars",
    description: "Kitchen sink test for the Star Wars questionnaire",
    introduction: {
      description: "May the force be with you"
    },
    display: {
      properties: { }
    },
    eq_id: "0",
    messages: {
      INTEGER_TOO_LARGE: "Too big, that number is",
      NEGATIVE_INTEGER: "It must be a positive number",
      NOT_INTEGER: "Please enter an integer"
    },
    groups: [...]
  }


Schema definition
  mime_type
    The mime type of the schema
  schema_version
    The version number of the schema definition used to generate and parse the
    schema. Will always be 3 numbers separated by two dots e.g. "10.2.33" with the 
    intention being MAJOR.MINOR.PATCH no guarantees are given to compatibility 
    across version changes.
  questionnaire_id
    The questionnaire id as used by EQ.
  survey_id
    The numerical survey number as used across the ONS.
  title
    The title of the survey.
  description
    A description of the survey.
  theme
    The theme that the survey will use when rendered.
  introduction
    description
  groups
    Array of groups within a questionnaire

.. toctree::
   :maxdepth: 2

   schemata/group
   schemata/block
   schemata/section
   schemata/questions