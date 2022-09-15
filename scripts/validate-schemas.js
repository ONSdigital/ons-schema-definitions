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

const validateSchemaForFile = (fileName, baseSchema) => {
  const validate = ajValidator.compile(baseSchema);

  const jsonData = JSON.parse(fs.readFileSync(fileName));
  const result = validate(jsonData);
  if (result) {
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
    const isValid = validateSchemaForFile(file, baseSchema);

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
