Introduction
============

EDC(Electronic data collection) is a set of components that enable the collection of survey data from respondents for use by the ONS (Office of National Statistics) in it's statistical processes.

Current under development components are:

* **Respondent portal/ management (RM)** An authorisation provider and sample management tool (not available as opensource, yet)
* **Electronic Questionnaire (EQ)** A Survey authoring, publishing and survey collecting system `EQ on Github <https://github.com/ONSDigital/?utf8=%E2%9C%93&query=eq->`_
* **Data Exchange (DE)** A response accepting system for consuming responses from EQ into the ONS.


There are two key integrations:

 * From RM to EQ via an encrypted `JWT <http://jwt.io/>`_ (RFC 7519)
 * From EQ to DE team systems




Contribute
----------

EQ Survey Runner

* Issue Tracker: https://github.com/ONSDigital/eq-surveyrunner/issues
* Source Code: https://github.com/ONSDigital/eq-surveyrunner


License
-------

The project is licensed under the MIT license and is covered by Crown Copyright
