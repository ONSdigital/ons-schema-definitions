# Survey Data Collection Documentation

This project holds the documentation for sharing and agreeing interfaces
between different components in the SDC suite of components. 

## Proposing Changes
1. Open a PR with proposed API changes
1. Add reviewers to the PR this change may affect
1. Changes should be agreed upon and approved between all affected teams
1. Any work that will come out of the proposal should be put on the teams backlogs

## Docs

Documentation can be found in `/docs`.

- [JWT Profile](docs/jwt_profile.md)
- [Respondent Management (RM) to eQ Runner (eQ)](docs/respondent_management_to_electronic_questionnaire_runner.md)
- [Electronic Questionnaire Runner Response To Downstream](docs/electronic_questionnaire_runner_to_downstream.md)
- [Survey Data Exchange to and from Respondent Account Services](docs/survey_data_exchange_to_respondent_account_services.md)
- [JSON Examples](examples)

## JSON Schema Validation

Both the launch and receipting JSON schema can be validated using JSON Schema definitions. The JSON schemas are defined using [Draft 2020-12](https://json-schema.org/specification-links.html#2020-12) and are validated via [AJV](https://ajv.js.org/). 

### Prerequisites
- Node installed matching the version specified in `.nvmrc`. It is recommended that you use [nvm](https://github.com/nvm-sh/nvm) to manage your Node versions.
- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (JS package and dependency manager)

**Install dependencies:**

```bash
npm install
```

**Validate all examples schemas**

```bash
./scripts/validate-schemas.js
```

**Validate a single file or folder**

```bash
./scripts/validate-schemas.js <schema-type> <schema-file-or-folder>
```

For example:
```bash
./scripts/validate-schemas.js submission_v2 examples/eq_runner_to_downstream/payload_v2/adhoc/
```

Help:
```bash
./scripts/validate-schemas.js --help
```


## Development

Format JSON/JS files
```bash
npm run format
```

Lint JSON/JS files
```bash
npm run lint
```
