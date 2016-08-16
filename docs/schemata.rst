EQ Author Schemata
=====================

This schemata describes the structure and content of eq surveys, as accepted by the eq-author and eq-survey-runner.

Broadly, surveys are structured as groups of blocks. Blocks contain sections, which contain questions. Each question has at least one answer with a number of possible options. 


Questions
=========

Starting from the lowest level, a question is represented as a json object containing a collection of answers, which may have a number of options.

.. code-block: json

  {
      "answers": [
          {
              "display": {
                  "properties": {
                      "columns": true
                  }
              },
              "guidance": "",
              "id": "91631df0-4356-4e9f-a9d9-ce8b08d26eb3",
              "label": "",
              "mandatory": true,
              "options": [
                  {
                      "label": "Dan Skywalker",
                      "value": "Dan Skywalker"
                  },
                  {
                      "label": "Hans Solarren",
                      "value": "Hans Solarren"
                  },
                  {
                      "label": "Leyoda",
                      "value": "Leyoda"
                  },
                  {
                      "label": "Davewbacca",
                      "value": "Davewbacca"
                  }
              ],
              "q_code": "21",
              "type": "Radio",
              "validation": {
                  "messages": {}
              }
          }
      ],
      "description": "",
      "display": {
          "properties": {}
      },
      "id": "680f2ff9-d5a5-4057-b1cd-9fde2660b244",
      "title": "A wise choice young Yedi. Pick your hero",
      "type": "General",
      "validation": []
  }

Sections
========

Sections are collections of questions which are grouped together on the same page.

.. code-block: json

  "sections": [
  {
      "description": "",
      "display": {
          "properties": {}
      },
      "id": "ed3e200a-0735-4e8d-9eea-627c1d908697",
      "questions": [
        ...,
        ...
      ],
      "title": "Choose your side",
      "validation": []
  }

Blocks
======

A block describes the content/validation of an individual page in a survey and the transitions to subsequent pages using "routing_rules".

.. code-block: json

  {
    display: {
      properties: { }
    },
    id: "f22b1ba4-d15f-48b8-a1f3-db62b6f34cc0",
    sections: [
      ...
    ],
    routing_rules: [
      {
        goto: {
          id: "96682325-47ab-41e4-a56e-8315a19ffe2a",
          when: {
            id: "ca3ce3a3-ae44-4e30-8f85-5b6a7a2fb23c",
            condition: "equals",
            value: "Light Side"
          }
        }
      },
      ...
    ],
    title: "",
    validation: [ ]
  }

Survey
======

The top level survey element describes metadata around the survey, including all the groups of blocks which exist within it.

.. code-block: json

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
  groups: [
    {
      blocks: [
        ...
      ],
      display: {
        properties: { }
      },
      id: "14ba4707-321d-441d-8d21-b8367366e766",
        title: ""
      }
    ]
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

    Array of elements

      id
      title
      blocks

        Array of elements

          id
          title
          sections

            Array

              id
              title
              description
              questions

                Array

                  id
                  title
                  description
                  skip_condition
                    when
                      id
                      condition
                      value

                type
                answers

                  Array

                    id
                    q_code
                    label
                    guidance
                    type
                    options
                    mandatory
                    alias
                    display
                      properties
                        max_length

            routing_rules
              Array of objects

                goto

                  id
                  when
                    id
                    condition
                    value

                repeat
                  answer_id
                  goto


