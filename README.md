# Survey Data Collection Documentation

This project is a sphinx documentation setup for sharing and agreeing interfaces
between different components in the SDC suite of components.

## Proposing Changes
1. Open a PR with proposed API changes
1. Add reviewers to the PR this change may affect
1. Changes should be agreed upon and approved between all affected teams
1. Any work that will come out of the proposal should be put on the teams backlogs

## How to build

1. Install the project's required Python version: `pyenv install`
1. Create a new virtualenv and activate it: `pyenv virtualenv schemas && pyenv activate schemas`
1. Install required packages: `pip install -r requirements.txt`
1. Build the docs: `cd docs && make html`
1. The generated html documents will be in `docs/_build/html/`


## Latest Docs

- The latest docs are hosted on readethedocs.io here:

    http://ons-schema-definitions.readthedocs.io/
