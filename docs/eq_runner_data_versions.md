# EQ Runner: Data Versions

This document defines the data structure of EQ Runner's data versions.
EQ Runner currently supports two data versions, `0.0.1` and `0.0.3`.
The version of the data is determined by the `data_version` property defined in the schema JSON which subsequently decides which data converter EQ Runner uses for downstream submission.

---

## Version 0.0.1

`data`
  An object of key-value pairings.

  - For the payload `type` of `surveyresponse` these will typically contain answer responses using the business defined `q_code` as the key for each answer value.
  - For the payload `type` of `feedback` these will typically contain survey feedback form properties. Feedback can be in two formats.
    - Format 1:
      - `feedback_text`
      - `feedback_type`
      - `feedback_count`
    - Format 2 (legacy):
      - `name`
      - `email`
      - `message`
      - `url` **[OPTIONAL]**
    
### Example data version 0.0.1 for surveyresponse JSON payloads

```json
"data": {
    "001": "2016-01-01",
    "002": "2016-03-30"
}
```

### Example data version 0.0.1 for feedback JSON payload (Format 1)

```json
"data": {
    "feedback_text": "I like this survey",
    "feedback_type": "Page design and structure",
    "feedback_count": "7"
}
```

### Example data version 0.0.1 for feedback JSON payload (Format 2)

```json
"data": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "message": "Page design feedback"
}
```

---

## Version 0.0.3

`data`
  An object of key-value pairing.

  - For the payload `type` of `surveyresponse` these will typically contain the list items, the answers array and an optional answer codes array.

    - `lists`
        - An array of [list item objects](#list-item-object) built up during the questionnaire completion [list item object]
    - `answers`
        - An array of [answer objects](#answer-object)
    - `answer_codes`
        - An array of [answer code objects](#answer-code-object) to represent the `answer_id` (optionally the `answer_value`) to user-defined code relationship.
        - Only contains the mapping for responses provided in `data.answers`. It does not contain the mapping for the entire survey. However, mappings for all option values are provided for answers with option values, regardless of whether the response data contains all option values. eQ only filters the answer codes by `answer_id`. In other words, eQ will send answer codes for all answer_ids for which there is a response.

  - For the payload `type` of `feedback` these will typically contain survey feedback form properties with corresponding user entered values.
     - `feedback_text`
     - `feedback_type`
     - `feedback_count`

#### List Item Object

- `name`: the name of the list (e.g. `people-who-live-here`)
- `items`: an array of strings of the item identifiers in the list
- `primary_person`: [optional] the item identifier of the primary person in the list

#### Answer Object

- `answer_id`: the answer identifier
- `value`: the value of the answer(s) provided for the `answer_id`
- `list_item_id`: [optional] the ID of the list item the answer was provided for (if answering in the context of a list item)

#### Answer Code Object

- `answer_id`: the answer identifier
- `code`: the user-defined answer code
- `answer_value`: [optional] the option value for answers that support options.

**Rules**
- The `answer_id` for the answer code object will be present in at least one of the answer objects in `data.answers` and vice versa.
- The value for `code` is globally unique among all answers.
- The `answer_value` is an optional key that will only exist for answers that support options such as Radio, Dropdown, Relationship and Checkbox.
    - The key will only exist when there is a user-defined code against each option.

### Example data version 0.0.3 for surveyresponse JSON payload

```json
"data": {
    "lists": [
        ...
    ],
    "answers": [
        ...
    ],
    "answer_codes": [
        ...
    ]
}
```

**Lists Array Example**

```json
"lists": [
    {
        "name": "household",
        "primary_person": "AUZvFL",
        "items": [
            "AUZvFL",
            "yuRiRs"
        ]
    },
    {
        "name": "visitor",
        "items": [
            "vgeYGW"
        ]
    }
]
```

**Answers Array Example**

```json
"answers": [
    {
        // Example of a free text input box question
        "value": "piloting space shuttles",
        "answer_id": "job-description-answer"
    },
    {
        // Example of a single value for a radio button question
        "answer_id": "marriage-type-answer",
        "value": "Married"
    },
    {
        // Example of multiple values for a checkbox question
        "value": ["Eggs", "Bacon", "Spam"],
        "answer_id": "favourite-breakfast-food"
    },
    {
        "answer_id": "first-name",
        "value": "Colin",
        "list_item_id": "AUZvFL"
    },
    {
        "answer_id": "last-name",
        "value": "Cat",
        "list_item_id": "AUZvFL"
    },
    {
        "answer_id": "first-name",
        "value": "Dave",
        "list_item_id": "yuRiRs"
    },
    {
        "answer_id": "last-name",
        "value": "Dog",
        "list_item_id": "yuRiRs"
    }
]
```

**Answers Array Example (list item based relationship type)**

```json
"answers": [
    {
        // example of the list based relationship answser value array
        // based on a mother, father and 2 children
        "answer_id": "relationship-answer",
        "value": [
            {
                // Father's relationship to mother
                "list_item_id": "tkziBG",
                "to_list_item_id": "jBlqGM",
                "relationship": "Husband or Wife"
            },
            {
                // Father's relationships to child 1
                "list_item_id": "tkziBG",
                "to_list_item_id": "CEMVLw",
                "relationship": "Mother or Father"
            },
            {
                // Father's relationships to child 2
                "list_item_id": "tkziBG",
                "to_list_item_id": "uknZxD",
                "relationship": "Mother or Father"
            },
            {
                // Mother's relationship to child 1
                "list_item_id": "jBlqGM",
                "to_list_item_id": "CEMVLw",
                "relationship": "Mother or Father"
            },
            {
                // Mother's relationship to child 2
                "list_item_id": "jBlqGM",
                "to_list_item_id": "uknZxD",
                "relationship": "Mother or Father"
            },
            {
                // Child 1's relationship to child 2
                "list_item_id": "CEMVLw",
                "to_list_item_id": "uknZxD",
                "relationship": "Brother or Sister"
            }
        ]
    }
]
```

**Answer Array Example (Address type)**

```json
"answers": [
  // Example of 2 address question answers
  {
    "answer_id": "other-address-uk-answer",
    "value": {
      "line1": "20 My Street",
      "line2": "Middleton",
      "town": "Mint Town",
      "postcode": "AB12 CD1",
      "uprn": "722100964321"

    }
  },
  {
    "answer_id": "workplace-address-answer",
    "value": {
      "line1": "55 Your Street",
      "line2": "Lowerton",
      "town": "Ice Town",
      "postcode": "XY12 VW1"
    }
  }
]
```

**Answer Codes Example**

```json
"answer_codes": [
    {
      "answer_id": "textfield-answer",
      "code": "1"
    },
    {
      "answer_id": "number-answer",
      "code": "2"
    },
    {
      "answer_id": "radio-dropdown-checkbox-relationship-answer",
      "code": "3" // This should only exist and be used for dynamic answers or when codes for each option aren't given.
    },
    {
      "answer_id": "radio-dropdown-checkbox-relationship-answer",
      "answer_value": "RAD1",  // This is the value of the Dropdown/Radio/Checkbox/Relationship, not the label.
      "code": "3a"
    },
    {
      "answer_id": "radio-dropdown-checkbox-relationship-answer",
      "answer_value": "RAD2",  // This is the value of the Dropdown/Radio/Checkbox/Relationship, not the label.
      "code": "3b"
    }
  ],
```

### Example data version 0.0.3 feedback JSON payload

Feedback data format for `0.0.3` is the same as `0.0.1`. 
 - Format 1: [Example data version 0.0.1 for feedback JSON payload (Format 1)](#example-data-version-001-for-feedback-json-payload-format-1)
 - Format 2: [Example data version 0.0.1 for feedback JSON payload (Format 2)](#example-data-version-001-for-feedback-json-payload-format-2)
