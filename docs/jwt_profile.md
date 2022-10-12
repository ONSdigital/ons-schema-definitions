# JWT Profile

Where a definition uses JWT it **SHALL** conform to the following
profile:

The payload is contained within a JSON Web Tokens (JWT) \~ RFC 7519
signed as per JSON Web Signature (JWS) \~ RFC 7515. The signed JWT is
used as the payload to a JSON Web Encryption (JWE) \~ RFC 7516.

All definitions are as per the RFCs unless otherwise stated.

Note: All times will be UTC.

## UUID Definition

All references to UUIDs refer to UUID (version 4); 128-bits in length as
defined in RFC 4122 in their textual representation as defined in
section 3 "Namespace Registration Template" without the "[urn:uuid](urn:uuid):"
prefix e.g. "f81d4fae-7dec-11d0-a765-00a0c91e6bf6".

All UUIDs **MUST** be randomly generated such that there is negligible
probability that the same value will be used twice, even across multiple
servers. The same UUID value **MUST NOT** appear twice in the same JWT
in any claim.

## JWS Protected Header

JWS Protected Header **SHALL** contain the following claims:

- `typ` will be set to `JWT`
- `alg` will be set to `RS256`
- `kid` will be set to the SHA-1 hash of the digest of the Public Key for the Private Key used to sign
  (reference [https://tools.ietf.org/html/rfc7517#section-4.5](https://tools.ietf.org/html/rfc7517#section-4.5) and
  [https://tools.ietf.org/html/rfc3280#section-4.2.1.2](https://tools.ietf.org/html/rfc3280#section-4.2.1.2))

## JWT Payload

All JWT payloads **SHALL** include the follow claims:

- `tx_id` - Set to a random UUID.
  - Transaction ID used to trace a transaction through the whole system.
  - **MUST NOT** be the same as the `jti` value.
- `jti` - Set to a random UUID. See RFC 7519 definition of the `jti` claim.
  - `jti` claim **MUST NOT** be the same value as the `tx_id` in the JWT
    Payload (see UUID Definition).

The JWT payload can also contain specific other data (claims) defined in
the definitions within this website.

## Signing

JWT Protected Header and JWT Payload are signed with RSASSA-PKCS1-v1_5
using SHA-256 (RSA-SHA256) using a Private Key to form a JWS.

## JWE Header

JWE header will include the `alg` and `enc` claims:

- `alg` will be set to `RSA-OAEP`
- `enc` will be set to `A256GCM`
- `kid` will be set to the SHA-1 hash of the digest of the Public Key used to encrypt
  (reference [https://tools.ietf.org/html/rfc7517#section-4.5](https://tools.ietf.org/html/rfc7517#section-4.5) and
  [https://tools.ietf.org/html/rfc3280#section-4.2.1.2](https://tools.ietf.org/html/rfc3280#section-4.2.1.2))

## Encrypting

The encrypted signed JWT is used as the payload to a JWE.

The JWE header is used as the Additional Authenticated Data

A 256-bit random CEK and 96-bit IV is generated by the creator of the
JWT.

The entire JWT is encrypted with AES-256-GCM using the generated CEK and
IV and the Additional Authenticated Data. This process outputs a 128-bit
Authentication Tag.

The CEK is encrypted with the JWT receivers public key using the
RSAES-OAEP algorithm to produce the JWE Encrypted Key

The JWE is formed from the above values concatenated together (see
RFC7516).

## Decrypting

JWE payload is decrypted (reverse of encryption