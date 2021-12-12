%%%
title = "CRYSTALS-Dilithium JSON Encoding"
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
initials = "M."
surname = "Prorock"
fullname = "Michael Prorock"
#role = "editor"
organization = "Mesur"
[author.address]
email = "mprorock@mesur.io"

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

This document describes the lattice signature scheme CRYSTALS-Dilithium (CRYDI).  
The scheme is based on "Fiat-Shamir with Aborts"[Lyu09, Lyu12] utlizing a matrix
of polynomials for key material, and a vector of polynomials for signatures.  
The parameter set is strategically chosen such that the signing algorithm is large
enough to maintain zero-knowledge properties but small enough to prevent forgery of
signatures. An example implementation and test vectors are provided.

{mainmatter}

# Introduction

CRYSTALS-Dilithium is a Post Quantum approach to digital signatures that is 
an algorithmic apprach that seeks to ensure key pair and signing properties 
that is a strong implementation meeting Existential Unforgeability under 
Chosen Message Attack (EUF-CMA) properties, while ensuring that the security 
levels reached meet security needs for resistance to both classical and quantum
attacks.  The algoritm itself is based on hard problems over module lattices,
specifically Ring Learning with Errors (Ring-LWE).  For all security levels
the only operations required are variants of Keccak and number theoretic 
transforms (NTT) for the ring Zq[X]/(X256+1).  This ensures that to increase 
or decrease the security level invovles only the change of parameters rather
than re-implementation of a related algorithm.

While based on Ring-LWE, CRYSTALS-Dilithium has less algebraic structure than 
direct Ring-LWE implementations and more closely resembles the unstructured 
lattices used in Learning with Errors (LWE).  This brings a theorectical 
protection against future algebraic attacks on Ring-LWE that may be developed. 

CRYSTALS-Dilithium, brings several advantages over other approaches to 
signature suites:

- Post Quantum
- Simple implementation while maintaing security
- Signature and Public Key Size
- Conservative parameter space
- Parameter set adjustment for greater security
- Performance and optimization 


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

PK
: The public key for the signature scheme.

SK
: The secret key for the signature scheme.

signature
: The digital signature output.

message
: The input to be signed by the signature scheme.

sha256
: The SHA-256 hash function defined in [@!RFC6234].

shake256
: The SHAKE256 hash function defined in [@!RFC8702].

# Core Operations

This section defines core operations used by the scheme.

## Parameters

Unlike certain other approaches such as Ed25519 that have a large set of
parameters, CRYSTALS-Dilithium uses distinct numbers of paramters to
increase or decrease the security level according to the required
level for a particular scenario.  Under DILITHIUM-Crustals, the key
parameter specificiation determines the size of the matrix and thereby
the number of polynomials that describe he lattice.  For use according to 
this specification we do not recommend a parameter set of less than 3,
which should be sufficient to maintain 128bits of security for all known
classical and quantum attacks.  Under a parameter set at NIST level 3, a 
6x5 matrix is utilized that thereby consists of 30 polynomials.  

Parameter sets
|NIST Level|Matrix Size|memory in bits|
|2|4x4|97.8|
|3|6x5|138.7|
|5|8x7|187.4|

## DerivePublicKey

DerivePublicKey produces a public key from a private key.

```
PK = DerivePublicKey(SK)
```

Inputs:

- SK, an (integer, set of integer, set of polynomials) (TODO FIXME).

Outputs:

- PK, a public key

Procedure:

1. Remove d

2. Remove ds

3. calculate xs

4. return x, xs, kty, pset

## KeyValidate

KeyValidate checks if the public key is valid.

As an optimization, implementations MAY cache the result of KeyValidate in order to avoid unnecessarily repeating validation for known keys.

```
result = KeyValidate(PK)
```

Inputs:

- PK, a public key in the format output by DerivePublicKey.

Outputs:

- result, either VALID or INVALID

Procedure:

1. calculate xs1 from x

2. result = true && xs1 === xs

3. result = result && xs.length = 32

4. return result

## KeyGenerate

KeyGenerate produces a private key

```
SK = KeyGenerate()
```

Inputs:

- RAND, a random number generator? TODO FIXME.

Outputs:

- SK, a private key

Procedure:

1. ???

2. return SK

## Sign

//TODO

## Verify

// TODO

# Key Type "PQK"

A new key type (kty) value "PQK" (Post Quantum Key Pair) is defined for
public key algorithms that use octet strings as private and public
keys and that support cryptographic sponge fucntions. It has the following parameters:

o The parameter "kty" MUST be "PQK".

o The parameter "pset" MUST be one of the described parameter sets "2", "3", or "5".  
Parameter set "3" or above SHOULD be used for any situation requiring at least
128bits of security against both quantum and classical attacks

o The parameter "x" MUST be present and contain the public key
encoded using the base64url [RFC4648] encoding.

o The parameter "xs" MAY be present and contain the shake256 of the public key
encoded using the base64url [RFC4648] encoding.

o The parameter "d" MUST be present for private keys and contain the
private key encoded using the base64url encoding. This parameter
MUST NOT be present for public keys.

o The parameter "ds" MAY be present for private keys and contain the
shake256 of the private key encoded using the base64url encoding. This parameter
MUST NOT be present for public keys.

When calculating JWK Thumbprints [RFC7638], the three public key
fields are included in the hash input in lexicographic order:
"kty", and "x".

## publicKeyJwk

```
{
    "kty": "PQK",
    "pset": "3",
    "xs": "z3uZQVjflnRZDSZn1e8g4oKH4YUU6TnpvkU4WrrGdXw=",
    "x": "z7...",
}
```

## privateKeyJwk

```
{
    "kty": "PQK",
    "pset": "3",
    "xs": "z3uZQVjflnRZDSZn1e8g4oKH4YUU6TnpvkU4WrrGdXw=",
    "ds": "5DuZ8XoJQirc/5TE23tBcoGoHo+JTj1+9ULLXtCiySU=",
    "x": "z7...",
    "d": "z7u7Gw..."
}
```

# Algorithms

## Signatures

For the purpose of using the CRYSTALS-Dilithium Signature
Algorithm (CRYDI) for signing data using "JSON Web Signature (JWS)"
[RFC7515], algorithm "CRYDI" is defined here, to be applied as the
value of the "alg" parameter.

The following key subtypes are defined here for use with CRYDI:

      "pset"             CRYDI Paramter Set
      5                  CRYDI5
      3                  CRYDI3
      2                  CRYDI2

The key type used with these keys is "PQK" and the algorithm used for
signing is "CRYDI". These subtypes MUST NOT be used for key agreement.

The CRYDI variant used is determined by the subtype of the key
(CRYDI3 for "pset 3" and CRYDI2 for "pset 2").

### Signing

Signing for these is performed by applying the signing algorithm
defined in [TODO] to the private key (as private key), public key
(as public key), and the JWS Signing Input (as message). The
resulting signature is the JWS Signature. All inputs and outputs are
octet strings.

### Verifiying

Verification is performed by applying the verification algorithm
defined in [TODO] to the public key (as public key), the JWS
Signing Input (as message), and the JWS Signature (as signature).
All inputs are octet strings. If the algorithm accepts, the
signature is valid; otherwise, the signature is invalid.

# Security Considerations

## Validating public keys

All algorithms in Section 2 that operate on public keys require first validating those keys.
For the sign, verify and proof schemes, the use of KeyValidate is REQUIRED.

## Side channel attacks

Implementations of the signing algorithm SHOULD protect the secret key from side-channel attacks. One method for protecting against certain side-channel attacks is ensuring that the implementation executes exactly the same sequence of instructions and performs exactly the same memory accesses, for any value of the secret key. ( this copied verbatum form [here](https://raw.githubusercontent.com/mattrglobal/bbs-signatures-spec/master/spec.md)).

## Randomness considerations

It is recommended that the all nonces are from a trusted source of randomness.

# IANA Considerations

The following has NOT YET been added to the "JSON Web Key Types" registry:

o "kty" Parameter Value: "PQK"
o Key Type Description: Octet string key pairs
o JOSE Implementation Requirements: Optional
o Change Controller: IESG
o Specification Document(s): Section 2 of this document (RFC TBD)

The following has NOT YET been added to the "JSON Web Key Parameters"
registry:

o Parameter Name: "pset"
o Parameter Description: The parameter set of the crypto system
o Parameter Information Class: Public
o Used with "kty" Value(s): "PQK"
o Change Controller: IESG
o Specification Document(s): Section 2 of this document (RFC TBD)

o Parameter Name: "xs"
o Parameter Description: The shake256 of the public key
o Parameter Information Class: Public
o Used with "kty" Value(s): "PQK"
o Change Controller: IESG
o Specification Document(s): Section 2 of this document (RFC TBD)

o Parameter Name: "ds"
o Parameter Description: The shake256 of the private key
o Parameter Information Class: Private
o Used with "kty" Value(s): "PQK"
o Change Controller: IESG
o Specification Document(s): Section 2 of this document (RFC TBD)

o Parameter Name: "d"
o Parameter Description: The private key
o Parameter Information Class: Private
o Used with "kty" Value(s): "OKP"
o Change Controller: IESG
o Specification Document(s): Section 2 of RFC 8037

o Parameter Name: "x"
o Parameter Description: The public key
o Parameter Information Class: Public
o Used with "kty" Value(s): "OKP"
o Change Controller: IESG
o Specification Document(s): Section 2 of RFC 8037

The following has NOT YET been added to the "JSON Web Signature and
Encryption Algorithms" registry:

o Algorithm Name: "CRYDI3"
o Algorithm Description: CRYDI3 signature algorithms
o Algorithm Usage Location(s): "alg"
o JOSE Implementation Requirements: Optional
o Change Controller: IESG

o Specification Document(s): Section 3.1 of this document (RFC TBD)
o Algorithm Analysis Documents(s): [RFC TBD]

The following has been added to the "JSON Web Key Lattice"
registry:

o Lattice Name: "CRYDI5"
o Lattice Description: Dilithium 5 signature algorithm key pairs
o JOSE Implementation Requirements: Optional
o Change Controller: IESG
o Specification Document(s): Section 3.1 of this document (RFC TBD)

o Lattice Name: "CRYDI3"
o Lattice Description: Dilithium 3 signature algorithm key pairs
o JOSE Implementation Requirements: Optional
o Change Controller: IESG
o Specification Document(s): Section 3.1 of this document (RFC TBD)

o Lattice Name: "CRYDI2"
o Lattice Description: Dilithium 2 signature algorithm key pairs
o JOSE Implementation Requirements: Optional
o Change Controller: IESG
o Specification Document(s): Section 3.1 of this document (RFC TBD)

# Appendix

- JSON Web Signature (JWS) - [RFC7515][spec-jws]
- JSON Web Encryption (JWE) - [RFC7516][spec-jwe]
- JSON Web Key (JWK) - [RFC7517][spec-jwk]
- JSON Web Algorithms (JWA) - [RFC7518][spec-jwa]
- JSON Web Token (JWT) - [RFC7519][spec-jwt]
- JSON Web Key Thumbprint - [RFC7638][spec-thumbprint]
- JWS Unencoded Payload Option - [RFC7797][spec-b64]
- CFRG Elliptic Curve ECDH and Signatures - [RFC8037][spec-okp]
- CRYSTALS-Dilithium - [Dilithium][spec-crystals-dilithium]

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
[spec-crystals-dilithium]: https://www.pq-crystals.org/dilithium/data/dilithium-specification-round3-20210208.pdf

## Test Vectors

//TODO

{backmatter}
