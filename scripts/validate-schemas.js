#!/usr/bin/env node

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import fs from "fs";
import glob from "glob";
import esMain from "es-main";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Coloured console output
const foregroundRed = "\x1b[31m%s\x1b[0m";
const foregroundYellow = "\x1b[33m%s\x1b[0m";
const foregroundGreen = "\x1b[32m%s\x1b[0m";

const ajValidator = new Ajv2020({
  allErrors: true,
  strict: false,
});
addFormats(ajValidator);

const baseSchemaToSchemaTypeMapping = {
  launch_v1: "schemas/launch_v1.json",
  launch_v2: "schemas/launch_v2.json",
  submission_v1: "schemas/submission_v1.json",
  submission_v2: "schemas/submission_v2.json",
};

const schemaTypesToExamplesGlob = {
  launch_v1: "examples/rm_to_eq_runner/*v1*/**/*.json",
  launch_v2: "examples/rm_to_eq_runner/*v2*/**/*.json",
  submission_v1: "examples/eq_runner_to_downstream/*v1*/**/*.json",
  submission_v2: "examples/eq_runner_to_downstream/*v2*/**/*.json",
};

const loadCommonSchemas = () => {
  const commonSchemasGlob = "schemas/common/*.json";
  const schemas = glob.sync(commonSchemasGlob);

  if (schemas.length === 0) {
    console.error(foregroundRed, `No schemas found for ${commonSchemasGlob}`);
    return;
  }

  schemas.forEach((currentSchema) => {
    const data = fs.readFileSync(currentSchema);
    ajValidator.addSchema(JSON.parse(data));
  });
};

const validateSubmissionAnswerCodes = (jsonData) => {
  /**
   * This function validates:
   *  - data.answer_codes.code is globally unique
   *  - data.answer_codes.answer_id exists in data.answers
   *  - data.answers.answer_id exists in data.answer_codes
   */

  const errors = [];

  const answerCodes = jsonData.data.answer_codes;
  if (!answerCodes) {
    return errors;
  }

  const answers = jsonData.data.answers;

  // Create a Set to store the answer_id values from the answers array
  const answerIds = new Set(answers.map((answer) => answer.answer_id));
  // Create a Set to store the code values from the answer_codes array
  const codes = new Set(answerCodes.map((entry) => entry.code));

  const missingCodes = codes.size - answerCodes.length;
  if (missingCodes) {
    errors.push(
      `data.answer_codes.code must be globally unique. Found ${Math.abs(
        missingCodes
      )} duplicate code(s).`
    );
  }

  // Iterate over the answer_codes array and check if the answer_id exists in the answerIds Set
  for (const code of answerCodes) {
    if (!answerIds.has(code.answer_id)) {
      errors.push(
        `Answer ID '${code.answer_id}' from data.answer_codes does not exist in the data.answers array`
      );
    }
  }

  // Iterate over the answers array and check if the answer_id exists in the answer_codes array
  for (const answer of answers) {
    // eslint-disable-next-line camelcase
    if (!answerCodes.some((code) => code.answer_id === answer.answer_id)) {
      // If the answer_id doesn't exist, log out a message
      errors.push(
        // eslint-disable-next-line camelcase
        `Answer ID '${answer.answer_id}' from data.answers does not exist in the data.answer_codes array`
      );
    }
  }

  return errors;
};

const validateSchemaForFile = (fileName, baseSchema, schemaType) => {
  const validate = ajValidator.compile(baseSchema);

  const jsonData = JSON.parse(fs.readFileSync(fileName));
  const result = validate(jsonData);
  if (result) {
    // Validate answer_codes for submission schemas
    if (schemaType.includes("submission")) {
      const errors = validateSubmissionAnswerCodes(jsonData);

      if (errors.length) {
        console.error(foregroundRed, `\n---\n${fileName} - FAILED`);
        console.dir(
          { Errors: errors },
          {
            depth: null,
          }
        );
        return false;
      }
    }

    console.log(foregroundGreen, `${fileName} - PASSED`);
    return true;
  }

  console.error(foregroundRed, `\n---\n${fileName} - FAILED`);
  console.dir(validate.errors, { depth: null });
  return false;
};

const validateSchemas = (schemaType, filepathOrGlob) => {
  const baseSchema = JSON.parse(
    fs.readFileSync(baseSchemaToSchemaTypeMapping[schemaType])
  );

  let passed = 0;
  let failed = 0;

  filepathOrGlob = filepathOrGlob.endsWith(".json")
    ? filepathOrGlob
    : `${filepathOrGlob}/**/*.json`;

  const files = glob.sync(`${filepathOrGlob}`);

  if (files.length === 0) {
    console.error(foregroundRed, `No files found for ${filepathOrGlob}`);
    return false;
  }

  console.info(
    foregroundYellow,
    `Validating schema "${filepathOrGlob}" (${schemaType})`
  );

  files.forEach((file) => {
    const isValid = validateSchemaForFile(file, baseSchema, schemaType);

    if (isValid === true) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(
    `\n${foregroundGreen} - ${foregroundRed}`,
    `Passed: ${passed}`,
    `Failed: ${failed}\n---\n`
  );

  return !failed;
};

if (esMain(import.meta)) {
  yargs(hideBin(process.argv))
    .usage(
      `Usage: ./scripts/validate-schemas.js <schema-type> <schema-file-or-folder>`
    )
    .example(
      "./scripts/validate-schemas.js submission_v2 /examples/payload_v2/surveyresponse_0_0_3.json"
    )
    .command(
      "$0",
      "Validate a schema or folder of schemas against the launch/submission schema definition.",
      (opt) => {
        opt.positional("schema-type", {
          describe: `The type of schema to use for validation. One of: ${Object.keys(
            baseSchemaToSchemaTypeMapping
          )}`,
        });
        opt.positional("schema-file-or-folder", {
          describe: "The schema file or folder to validate. ",
        });
      },
      (argv) => {
        const schemaType = argv._[0];
        const schemaFileOrGlob = argv._[1];
        loadCommonSchemas();

        let anyFailed = false;

        const schemasMap =
          schemaType && schemaFileOrGlob
            ? { [schemaType]: schemaFileOrGlob }
            : schemaTypesToExamplesGlob;

        for (const [sType, folderGlob] of Object.entries(schemasMap)) {
          if (!(sType in baseSchemaToSchemaTypeMapping)) {
            console.error(
              foregroundRed,
              `Invalid schema type ${sType}. Schema type must be one of:`
            );
            console.dir(Object.keys(baseSchemaToSchemaTypeMapping));
            console.log(`Help: ./scripts/validate-schemas.js --help`);
            return;
          }

          const passed = validateSchemas(sType, folderGlob);
          anyFailed |= !passed;
        }

        if (anyFailed) {
          process.exit(1);
        }
      }
    )
    .wrap(null)
    .parse();
}
