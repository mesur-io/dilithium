%%%
title = "Dilithium JSON Encoding"
abbrev = "dilithium-jose"
ipr= "none"
area = "Internet"
workgroup = "none"
submissiontype = "IETF"
keyword = [""]

[seriesInfo]
name = "Individual-Draft"
value = "dilithium-jose-00"
status = "informational"

[[author]]
initials = "P."
surname = "Prorock"
fullname = "Mike Prorock"
#role = "editor"
organization = "Mesur"
[author.address]
email = "mike@mesur.io"

[[author]]
initials = "O."
surname = "Steele"
fullname = "Orie Steele"
#role = "editor"
organization = "Transmute"
[author.address]
email = "orie@transmute.industries"

%%%

.# Abstract

TODO

{mainmatter}

# Introduction

TODO

## Notational Conventions

The keywords **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**,
**SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL**, when they appear in this
document, are to be interpreted as described in [@!RFC2119].

# Overview

//TODO

## Organization of this document

This document is organized as follows:

- [Section 2](#section-2) defines terminology and the high-level API.

TODO

## Terminology

The following terminology is used throughout this document:

SK
: The secret key for the signature scheme.

sha256
: The SHA-256 hash function defined in [@!RFC6234].

# Core Operations

This section defines core operations used by the scheme.

## Parameters

The core operations in this section depend on several parameters:

<!-- IF we want to parameterize we can... recommend we remove this section, not provide only 1 value for any parameter. -->

- H, a hash function that MUST be a secure cryptographic hash function, e.g. SHA-256.

## KeyValidate

KeyValidate checks if the public key is valid.

// TODO

## KeyGenerate

// TODO

## Sign

//TODO

## Verify

// TODO

# JOSE Encoding

// TODO

## JWK

// TODO

## JWS

// TODO

# Security Considerations

## Validating public keys

All algorithms in Section 2 that operate on public keys require first validating those keys.
For the sign, verify and proof schemes, the use of KeyValidate is REQUIRED.

## Side channel attacks

Implementations of the signing algorithm SHOULD protect the secret key from side-channel attacks. One method for protecting against certain side-channel attacks is ensuring that the implementation executes exactly the same sequence of instructions and performs exactly the same memory accesses, for any value of the secret key. ( this copied verbatum form [here](https://raw.githubusercontent.com/mattrglobal/bbs-signatures-spec/master/spec.md)).

## Randomness considerations

It is recommended that the all nonces are from a trusted source of randomness.

# IANA Considerations

This document does not make any requests of IANA.

TODO:

Request for JOSE and COSE...:

- alg: FOO128
- kty: BAR128
- etc...

# Appendix

- JSON Web Signature (JWS) - [RFC7515][spec-jws]
- JSON Web Encryption (JWE) - [RFC7516][spec-jwe]
- JSON Web Key (JWK) - [RFC7517][spec-jwk]
- JSON Web Algorithms (JWA) - [RFC7518][spec-jwa]
- JSON Web Token (JWT) - [RFC7519][spec-jwt]
- JSON Web Key Thumbprint - [RFC7638][spec-thumbprint]
- JWS Unencoded Payload Option - [RFC7797][spec-b64]
- CFRG Elliptic Curve ECDH and Signatures - [RFC8037][spec-okp]

[spec-b64]: https://tools.ietf.org/html/rfc7797
[spec-cookbook]: https://tools.ietf.org/html/rfc7520
[spec-jwa]: https://tools.ietf.org/html/rfc7518
[spec-jwe]: https://tools.ietf.org/html/rfc7516
[spec-jwk]: https://tools.ietf.org/html/rfc7517
[spec-jws]: https://tools.ietf.org/html/rfc7515
[spec-jwt]: https://tools.ietf.org/html/rfc7519
[spec-okp]: https://tools.ietf.org/html/rfc8037
[spec-secp256k1]: https://tools.ietf.org/html/rfc8812
[spec-thumbprint]: https://tools.ietf.org/html/rfc7638

## Test Vectors

//TODO

{backmatter}
