Blocks
======

A block describes the sections, validation and transitions of an individual page in a questionnaire.

Each block has an id displayed within the url of the survey runner. The users route through the questionnaire is defined as moving from block to
block. Transitions to subsequent blocks are described within routing rules.

.. code-block:: javascript

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