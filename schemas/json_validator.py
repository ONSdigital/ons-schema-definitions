import json
import logging

from argparse import ArgumentParser
from jsonschema import SchemaError, ValidationError, validate


def validate_document_with_schema(document, schema):
    try:
        validate(document, schema)

    except ValidationError as e:
        logging.error(
            'Schema Validation Error! [{}] does not validate against schema. Error [{}]'.format(
                document, e
            )
        )

    except SchemaError as e:
        logging.error(
            'JSON Parse Error! Could not parse [{}]. Error [{}]'.format(
                document, e)
        )


if __name__ == "__main__":
    parser = ArgumentParser(description="Validate a JSON document against a JSON schema see https://json-schema.org")
    parser.add_argument("schema", help="The JSON Schema to use to validate the document")
    parser.add_argument("document", help="The JSON Document to validate against the schema")
    args = parser.parse_args()

    with open(args.document) as document_file, open(args.schema) as schema_file:
        document = json.load(document_file)
        schema = json.load(schema_file)
        validate_document_with_schema(document, schema)
