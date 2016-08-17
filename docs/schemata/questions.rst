Questions
=========

A question is represented as a object containing a collection of answers, which may have a number of options.

.. code-block:: javascript

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