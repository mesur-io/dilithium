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
organization = "mesur.io"
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

- Post Quantum in nature - use of lattices and other approaches that should
remain hard problems even when under attack utilizing quantum approaches
- Simple implementation while maintaing security - a danger in many possible
approaches to cryptography is that it may be possible inadvertantly introduce
errors in code that lead to weakness or decreases in security level 
- Signature and Public Key Size - compared to other post quantum approaches
a reasonable key size has been achieved that also preserves desired security
properties
- Conservative parameter space - parameterization is utilized for the purposes
of defining the sizes of marices in use, and thereby the number of polynomials
described by the key material.  
- Parameter set adjustment for greater security - increasing this matrix size 
increases the number of polynomials, and thereby the security level
- Performance and optimization - the approach makes use of well known 
transforms that can be highly optimized, especially with use of hardware
optimizations without being so large that it cannot be deployed in embedded
or IoT environments without some degree of optimization.

The primary known disadvantage to CRYSTALS-Dilithium is the size of keys and
signatures, especially as compared to classical approaches for digital signing.

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

### Parameter sets

Parameter sets are identified by the corresponding NIST level per the
table below

|NIST Level|Matrix Size|memory in bits|
|---|---|---|
|2|4x4|97.8|
|3|6x5|138.7|
|5|8x7|187.4|

## Generate Key Pair

//TODO

## Sign

//TODO

## Verify

// TODO

# Key Type "PQK"

A new key type (kty) value "PQK" (Post Quantum Key Pair) is defined for
public key algorithms that use base 64 encoded strings of the underlying binary materia
as private and public keys and that support cryptographic sponge fucntions. 
It has the following parameters:

o The parameter "kty" MUST be "PQK".

o The patameter "alg" MUST be specified, and at this time MAY only be "CRYDI" until
other algorithms are specified

o The parameter "pset" MUST be specfied to indicate the not only paramter set
in use for the algorithm, but SHOULD also reflect the targeted NIST level for the 
algorithm in combination with the specified paramter set. 
For "alg" "CRYDI" one of the described parameter sets "2", "3", or "5" MUST be 
specified. Parameter set "3" or above SHOULD be used with "CRYDI" for any situation 
requiring at least 128bits of security against both quantum and classical attacks

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

When calculating JWK Thumbprints [RFC7638], the four public key
fields are included in the hash input in lexicographic order:
"kty", "alg", "pset", and "x".

## publicKeyJwk

```
{
    "kty": "PQK",
    "alg": "CRYDI",
    "pset": "3",
    "xs": "z3uZQVjflnRZDSZn1e8g4oKH4YUU6TnpvkU4WrrGdXw=",
    "x": "z7...",
}
```

## privateKeyJwk

```
{
    "kty": "PQK",
    "alg": "CRYDI",
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
base 64 encoded strings.

### Verifiying

Verification is performed by applying the verification algorithm
defined in [TODO] to the public key (as public key), the JWS
Signing Input (as message), and the JWS Signature (as signature).
All inputs are base 64 encoded strings. If the algorithm accepts, the
signature is valid; otherwise, the signature is invalid.

# Security Considerations

## Validating public keys

All algorithms in Section 2 that operate on public keys require first validating those keys.
For the sign, verify and proof schemes, the use of KeyValidate is REQUIRED.

## Side channel attacks

Implementations of the signing algorithm SHOULD protect the secret key from side-channel attacks. 
Multiple best practices exist to protect against side-channel attacks.  Any implementation
of the the CRYSTALS-Dilithium signing algorithm SHOULD utilize the following best practices
at a minimum:

- Constant timing - the implementation should ensure that constant time is utilized in operations
- Sequence and memory access persistance - the implemention SHOULD execute the exact same 
sequence of instructions (at a machine level) with the exact same memory access independent
of which polynomial is being operated on.
- Uniform sampling - uniform sampling is the default in CRYSTALS-Dilithium to prevent information
leakage, however care should be given in implementations to preserve the property of uniform
sampling in implementation.
- Secrecy of S1 - utmost care must be given to protection of S1 and to prevent information or 
power leakage.  As is the case with most proposed lattice based approaches to date, fogery and
other attacks may succeed through [leakage of S1](https://eprint.iacr.org/2018/821.pdf) through side channel mechanisms.

## Randomness considerations

It is recommended that the all nonces are from a trusted source of randomness.

# IANA Considerations

The following has NOT YET been added to the "JSON Web Key Types" registry:

o "kty" Parameter Value: "PQK"
o Key Type Description: Base 64 encoded string key pairs
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
o Used with "kty" Value(s): "PQK"
o Change Controller: IESG
o Specification Document(s): Section 2 of RFC 8037

o Parameter Name: "x"
o Parameter Description: The public key
o Parameter Information Class: Public
o Used with "kty" Value(s): "PQK"
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
