EQ Author Schemata
=====================

Schema definition
  mime_type
  schema_version
  questionnaire_id
  survey_id
  title
  description
  theme
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


