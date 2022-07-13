# Survey Data Exchange to and from Respondent Account Services

Collection Instruments are uploaded from the ONS estate to a RabbitMQ
queue for consumption by RAS. To facilitate this the excel files are
base64 encoded and then wrapped in a JWT. This JWT is encrypted and
signed before being placed on the queue.

Once the Collection Instruments have been completed by the respondent
RAS re-encodes them and wraps them in a signed and encrypted JWT to be
transferred back into the ONS estate.

## Schema Definition

| **Property** | **Definition**                                           |
| ------------ | -------------------------------------------------------- |
| **tx_id**    | See: [JWT Profile][jwt_profile]                          |
| **file**     | The contents of the Collection Instrument base64 encoded |
| **filename** | The name of the collection instrument file               |
| **case_id**  | The case UUID                                            |

[jwt_profile]: jwt_profile.md "JWT Profile Definition"
