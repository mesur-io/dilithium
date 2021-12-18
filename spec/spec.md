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
attacks. The algoritm itself is based on hard problems over module lattices,
specifically Ring Learning with Errors (Ring-LWE). For all security levels
the only operations required are variants of Keccak and number theoretic
transforms (NTT) for the ring Zq[X]/(X256+1). This ensures that to increase
or decrease the security level invovles only the change of parameters rather
than re-implementation of a related algorithm.

While based on Ring-LWE, CRYSTALS-Dilithium has less algebraic structure than
direct Ring-LWE implementations and more closely resembles the unstructured
lattices used in Learning with Errors (LWE). This brings a theorectical
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

# Parameters

Unlike certain other approaches such as Ed25519 that have a large set of
parameters, CRYSTALS-Dilithium uses distinct numbers of paramters to
increase or decrease the security level according to the required
level for a particular scenario. Under DILITHIUM-Crustals, the key
parameter specificiation determines the size of the matrix and thereby
the number of polynomials that describe he lattice. For use according to
this specification we do not recommend a parameter set of less than 3,
which should be sufficient to maintain 128bits of security for all known
classical and quantum attacks. Under a parameter set at NIST level 3, a
6x5 matrix is utilized that thereby consists of 30 polynomials.

## Parameter sets

Parameter sets are identified by the corresponding NIST level per the
table below

{align="left"}

| NIST Level | Matrix Size | memory in bits |
| ---------- | ----------- | -------------- |
| 2          | 4x4         | 97.8           |
| 3          | 6x5         | 138.7          |
| 5          | 8x7         | 187.4          |

# Core Operations

This section defines core operations used by the signature scheme, as proposed in [@!CRYSTALS-Dilithium].

## Generate

<!-- In order for svg figures to show, they must be bundled into the build -->
<!-- https://viereck.ch/latex-to-svg/ -->
<!--


\begin{align*}
&\underline{\text{Gen}} \\
&01  \hspace{0.25cm} \textbf{A} \leftarrow R_{q}^{k \times \ell}\\
&02  \hspace{0.25cm} (s_{1}, s_{2}) \leftarrow S_{\eta}^{\ell} \times S_{\eta}^{k}\\
&03  \hspace{0.25cm} \textbf{t} := \textbf{A}s_{1} +  s_{2}\\
&04  \hspace{0.25cm} \textbf{ return } (pk = (\textbf{A},\textbf{t}),  sk=(\textbf{A},\textbf{t},s_{1},  s_{2}))\\
\end{align*}

 -->

!---
![svg](key-gen.svg "key generation")
!---

## Sign

<!--

\begin{align*}
&\underline{\text{Sign}(sk, M)} \\
&05  \hspace{0.25cm} \textbf{z} := \perp\\
&06  \hspace{0.25cm} \textbf{while z} = \perp \text{do}\\
&07  \hspace{0.25cm}  \hspace{0.25cm} \textbf{y} \leftarrow S_{\gamma_{1} -1}^{\ell}\\
&08  \hspace{0.25cm}  \hspace{0.25cm} \textbf{w}_{1} := \text{HighBits}(\textbf{Ay}, 2\gamma_{2})\\
&09  \hspace{0.25cm}  \hspace{0.25cm} c \in B_{60} := \text{H}(M || \textbf{w}_{1})\\
&10  \hspace{0.25cm}  \hspace{0.25cm} \textbf{z}  := \textbf{y} + cs_{1}\\
&11  \hspace{0.25cm}  \hspace{0.25cm} \textbf{if} \hspace{0.15cm} ||\textbf{z}||_{\infty} \geq \gamma_{1} - \beta \hspace{0.15cm} \text{or} ||\text{LowBits}(\textbf{Ay} - cs_{2}, 2\gamma_{2})||_{\infty} \geq  \gamma_{2} - \beta, \text{then} \hspace{0.15cm}  \textbf{z} := \perp  \\
&12  \hspace{0.25cm} \textbf{return } \sigma = (\textbf{z}, c)\\

\end{align*}


 -->

!---
![svg](sign.svg "sign")
!---

## Verify

<!--


\begin{align*}
&\underline{\text{Verify}(pk, M, \sigma = (\textbf{z}, c))} \\
&13  \hspace{0.25cm} \textbf{w}_{1}^{\prime} := \text{HighBits}(\textbf{Az} - c\textbf{t}, 2\gamma_{2})\\
&14 \hspace{0.25cm}  \textbf{if return } [\![ ||\textbf{z}||_{\infty} < \gamma_{1} - \beta ]\!] \hspace{0.1cm}  \textbf{and} \hspace{0.1cm} [\![ c= \text{H} (M || \textbf{w}_{1}^{\prime})]\!]

\end{align*}

 -->

!---
![svg](verify.svg "verify")
!---

# Using CRYDI with JOSE

Basing off of [this](https://datatracker.ietf.org/doc/html/rfc8812#section-3)

## CRYDI Key Representations

A new key type (kty) value "PQK" (Post Quantum Key Pair) is defined for
public key algorithms that use base 64 encoded strings of the underlying binary materia
as private and public keys and that support cryptographic sponge functions.
It has the following parameters:

- The parameter "kty" MUST be "PQK".

- The patameter "alg" MAY be specified, and at this time MAY only be "CRYDI" until
  other algorithms are specified

- The parameter "pset" MUST be specfied to indicate the not only paramter set
  in use for the algorithm, but SHOULD also reflect the targeted NIST level for the
  algorithm in combination with the specified paramter set.
  For "alg" "CRYDI" one of the described parameter sets "2", "3", or "5" MUST be
  specified. Parameter set "3" or above SHOULD be used with "CRYDI" for any situation
  requiring at least 128bits of security against both quantum and classical attacks

- The parameter "x" MUST be present and contain the public key
  encoded using the base64url [@!RFC4648] encoding.  

- The parameter "xs" MAY be present and contain the shake256 of the public key
  encoded using the base64url [@!RFC4648] encoding.

- The parameter "d" MUST be present for private keys and contain the
  private key encoded using the base64url encoding. This parameter
  MUST NOT be present for public keys.  

- The parameter "ds" MAY be present for private keys and contain the
  shake256 of the private key encoded using the base64url encoding. This parameter
  MUST NOT be present for public keys.

Sizes of various key and signature material is as follows (for "pset" value "2")

| Variable    | Paramter Name | Paramter Set | Size | base64url encoded size |
| ----------- | ------------- | ------------ | ---- | ---------------------- |
| Signature   | sig           | 2            | 3293 | 4393                   |
| Public Key  | x             | 2            | 1952 | 2605                   |
| Private Key | d             | 2            | 4000 | 5337                   |

When calculating JWK Thumbprints [@!RFC7638], the four public key
fields are included in the hash input in lexicographic order:
"kty", "pset", and "x".

### Public Key

Per section 5.1 of [@!CRYSTALS-Dilithium]:

```
The public key, containing ρ and t1, is stored as the concatenation of
the bit-packed representations of ρ and t1 in this order.
Therefore, it has a size of 32 + 288 kbytes.
```

The public key is represented as `x` and encoded using base64url encoding as described in [@!RFC7517].

Example public key using only required fields:

```json
{
  "kty": "PQK",
  "pset": "3",
  "x": "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"
}
```

Example public key including optional fields:

```json
{
  "kid": "key-0",
  "kty": "PQK",
  "alg": "CRYDI",
  "pset": "3",
  "key_ops": ["verify"],
  "xs": "z3uZQVjflnRZDSZn1e8g4oKH4YUU6TnpvkU4WrrGdXw=",
  "ds": "5DuZ8XoJQirc/5TE23tBcoGoHo+JTj1+9ULLXtCiySU=",
  "x": "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"
}
```

### Private Key

Per section 5.1 of [@!CRYSTALS-Dilithium]:

```
The secret key contains ρ,K,tr,s1,s2 and t0 and is also stored as
a bit-packed representation of these quantities in the given order.
Consequently, a secret key requires 64 + 48 + 32((k+l)·dlog (2η+ 1)e+ 14k)bytes.
For the weak, medium and high security level this is equal to 112 + 576k+ 128lbytes.
With the very high security parameters one needs 112 + 544k+ 96l= 3856bytes.
```

The private key is represented as `d` and encoded using base64url encoding as described in [@!RFC7517].

Example private key using only required fields:

```json
{
  "kty": "PQK",
  "alg": "CRYDI",
  "pset": "3",
  "x": "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",
  "d": "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"
}
```

Example private key using optional fields:

```json
{
  "kid": "key-0",
  "kty": "PQK",
  "alg": "CRYDI",
  "pset": "3",
  "key_ops": ["sign"],
  "xs": "z3uZQVjflnRZDSZn1e8g4oKH4YUU6TnpvkU4WrrGdXw=",
  "ds": "5DuZ8XoJQirc/5TE23tBcoGoHo+JTj1+9ULLXtCiySU=",
  "x": "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",
  "d": "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"
}
```

## CRYDI Signature Representation

For the purpose of using the CRYSTALS-Dilithium Signature
Algorithm (CRYDI) for signing data using "JSON Web Signature (JWS)"
[@!RFC7515], algorithm "CRYDI" is defined here, to be applied as the
value of the "alg" parameter.

The following key subtypes are defined here for use with CRYDI:

| "pset" | CRYDI Paramter Set |
| ------ | ------------------ |
| 5      | CRYDI5             |
| 3      | CRYDI3             |
| 2      | CRYDI2             |

The key type used with these keys is "PQK" and the algorithm used for
signing is "CRYDI". These subtypes MUST NOT be used for key agreement.

The CRYDI variant used is determined by the subtype of the key
(CRYDI3 for "pset 3" and CRYDI2 for "pset 2").

Implementations need to check that the key type is "PQK" for JOSE and
that the pset of the key is a valid subtype when creating a
signature.

The CRYDI digital signature is generated as
follows:

1.  Generate a digital signature of the JWS Signing Input
    using CRYDI with the desired private key, as described in [Section 3.2](#name-sign).
    The signature bit string is the concatenation of a bit packed
    representation of z and encodings of h and c in this order.

2.  The resulting octet sequence is the JWS Signature.

When using a JWK for this algorithm, the following checks
are made:

- The "kty" field MUST be present, and it MUST be "PQK" for JOSE.

- The "pset" field MUST be present, and it MUST represent the
  pset subtype.

- If the "alg" field is present, it MUST represent the "CRYDI"
  algorithm.

- If the "key_ops" field is present, it MUST include "sign" when
  creating an CRYDI signature.

- If the "key_ops" field is present, it MUST include "verify" when
  verifying an CRYDI signature.

- If the JWK "use" field is present, its value MUST be "sig".

Example signature using only required fields, represented in compact form:

```json
eyJhbGciOiJQUzM4NCIsImtpZCI6ImJpbGJvLmJhZ2dpbnNAaG9iYml0b24uZX
hhbXBsZSJ9
.
SXTigJlzIGEgZGFuZ2Vyb3VzIGJ1c2luZXNzLCBGcm9kbywgZ29pbmcgb3V0IH
lvdXIgZG9vci4gWW91IHN0ZXAgb250byB0aGUgcm9hZCwgYW5kIGlmIHlvdSBk
b24ndCBrZWVwIHlvdXIgZmVldCwgdGhlcmXigJlzIG5vIGtub3dpbmcgd2hlcm
UgeW91IG1pZ2h0IGJlIHN3ZXB0IG9mZiB0by4
.
cu22eBqkYDKgIlTpzDXGvaFfz6WGoz7fUDcfT0kkOy42miAh2qyBzk1xEsnk2I
pN6-tPid6VrklHkqsGqDqHCdP6O8TTB5dDDItllVo6_1OLPpcbUrhiUSMxbbXU
vdvWXzg-UD8biiReQFlfz28zGWVsdiNAUf8ZnyPEgVFn442ZdNqiVJRmBqrYRX
e8P_ijQ7p8Vdz0TTrxUeT3lm8d9shnr2lfJT8ImUjvAA2Xez2Mlp8cBE5awDzT
0qI0n6uiP1aCN_2_jLAeQTlqRHtfa64QQSUmFAAjVKPbByi7xho0uTOcbH510a
6GYmJUAfmWjwZ6oD4ifKo8DYM-X72Eaw
```

The same example decoded for readability:

```json
{
  "header": { "alg": "CRYDI3", "kid": "did:example:123#key-0" },
  "payload": "It’s a dangerous business, Frodo, going out your door. You step onto the road, and if you don't keep your feet, there’s no knowing where you might be swept off to.",
  "signature": "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"
}
```

# Security Considerations

## Validating public keys

All algorithms in Section 2 that operate on public keys require first validating those keys.
For the sign, verify and proof schemes, the use of KeyValidate is REQUIRED.

## Side channel attacks

Implementations of the signing algorithm SHOULD protect the secret key from side-channel attacks.
Multiple best practices exist to protect against side-channel attacks. Any implementation
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
  power leakage. As is the case with most proposed lattice based approaches to date, fogery and
  other attacks may succeed through [leakage of S1](https://eprint.iacr.org/2018/821.pdf) through side channel mechanisms.

## Randomness considerations

It is recommended that the all nonces are from a trusted source of randomness.

# IANA Considerations

The following has NOT YET been added to the "JSON Web Key Types" registry:

- "kty" Parameter Value: "PQK"
- Key Type Description: Base 64 encoded string key pairs
- JOSE Implementation Requirements: Optional
- Change Controller: IESG
- Specification Document(s): Section 2 of this document (RFC TBD)

The following has NOT YET been added to the "JSON Web Key Parameters"
registry:

- Parameter Name: "pset"
- Parameter Description: The parameter set of the crypto system
- Parameter Information Class: Public
- Used with "kty" Value(s): "PQK"
- Change Controller: IESG
- Specification Document(s): Section 2 of this document (RFC TBD)
  <br />
- Parameter Name: "xs"
- Parameter Description: The shake256 of the public key
- Parameter Information Class: Public
- Used with "kty" Value(s): "PQK"
- Change Controller: IESG
- Specification Document(s): Section 2 of this document (RFC TBD)
  <br />
- Parameter Name: "ds"
- Parameter Description: The shake256 of the private key
- Parameter Information Class: Private
- Used with "kty" Value(s): "PQK"
- Change Controller: IESG
- Specification Document(s): Section 2 of this document (RFC TBD)
  <br />
- Parameter Name: "d"
- Parameter Description: The private key
- Parameter Information Class: Private
- Used with "kty" Value(s): "PQK"
- Change Controller: IESG
- Specification Document(s): Section 2 of RFC 8037
  <br />
- Parameter Name: "x"
- Parameter Description: The public key
- Parameter Information Class: Public
- Used with "kty" Value(s): "PQK"
- Change Controller: IESG
- Specification Document(s): Section 2 of RFC 8037

The following has NOT YET been added to the "JSON Web Signature and
Encryption Algorithms" registry:

- Algorithm Name: "CRYDI3"
- Algorithm Description: CRYDI3 signature algorithms
- Algorithm Usage Location(s): "alg"
- JOSE Implementation Requirements: Optional
- Change Controller: IESG
- Specification Document(s): Section 3.1 of this document (RFC TBD)
- Algorithm Analysis Documents(s): [RFC TBD]

The following has been added to the "JSON Web Key Lattice"
registry:

- Lattice Name: "CRYDI5"
- Lattice Description: Dilithium 5 signature algorithm key pairs
- JOSE Implementation Requirements: Optional
- Change Controller: IESG
- Specification Document(s): Section 3.1 of this document (RFC TBD)
  <br />
- Lattice Name: "CRYDI3"
- Lattice Description: Dilithium 3 signature algorithm key pairs
- JOSE Implementation Requirements: Optional
- Change Controller: IESG
- Specification Document(s): Section 3.1 of this document (RFC TBD)
  <br />
- Lattice Name: "CRYDI2"
- Lattice Description: Dilithium 2 signature algorithm key pairs
- JOSE Implementation Requirements: Optional
- Change Controller: IESG
- Specification Document(s): Section 3.1 of this document (RFC TBD)

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

<reference anchor='CRYSTALS-Dilithium' target='https://doi.org/10.13154/tches.v2018.i1.238-268'>
    <front>
        <title>CRYSTALS-Dilithium: A Lattice-Based Digital Signature Scheme</title>
        <author initials='L.' surname='Ducas' fullname='Léo Ducas'>
            <organization>CWI</organization>
        </author>
        <author initials='E.' surname='Kiltz' fullname='Eike Kiltz'>
            <organization>Ruhr Universität Bochum</organization>
        </author>
        <author initials='T.' surname='Lepoint' fullname='Tancrède Lepoint'>
            <organization>SRI International</organization>
        </author>
        <author initials='V.' surname='Lyubashevsky' fullname='Vadim Lyubashevsky'>
            <organization>IBM Research – Zurich</organization>
        </author>
        <author initials='P.' surname='Schwabe' fullname='Peter Schwabe'>
            <organization>Radboud University</organization>
        </author>
        <author initials='G.' surname='Seiler' fullname='Gregor Seiler'>
            <organization>IBM Research – Zurich</organization>
        </author>
        <author initials='D.' surname='Stehlé' fullname='Damien Stehlé'>
            <organization>ENS de Lyon</organization>
        </author>
        <date year='2018'/>
    </front>
</reference>

## Test Vectors

//TODO

{backmatter}
