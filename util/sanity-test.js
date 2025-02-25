const di = require("./dilithium.js");
const CRYPTO_BYTES = 2420;
const CRYPTO_BYTES_B64 = 3229;
const CRYPTO_PUBLICKEYBYTES_B64 = 1753;
const CRYPTO_SECRETKEYBYTES_B64 = 3373;
const KEYPAIR_BYTES_B64 =
  CRYPTO_SECRETKEYBYTES_B64 +
  CRYPTO_PUBLICKEYBYTES_B64 +
  CRYPTO_BYTES_B64 * 2 +
  64;

di().then((d) => {
  console.log("Setting up helper functions...");
  var toUint8Array = function (str) {
    var result = [];
    for (var i = 0; i < str.length; i += 2) {
      result.push(parseInt(str.substring(i, i + 2), 16));
    }
    return result;
  };
  var toCString = function (str, nBytes = 1, heap = d.HEAPU8) {
    const encoder = new TextEncoder();
    str = encoder.encode(str);
    var ptr = d._malloc(str.length * nBytes);
    heap.set(str, ptr / nBytes);
    return ptr;
  };
  var getCString = function (
    strPtr,
    size = 1024,
    nullTerm = false,
    heap = d.HEAPU8
  ) {
    var output_array = new Uint8Array(heap.buffer, strPtr, size);
    var endIdx = size;
    if (nullTerm) {
      endIdx = output_array.indexOf(0); // assumes null termination
    }
    output_array = output_array.slice(0, endIdx);
    var stringValue = new TextDecoder().decode(output_array);
    return stringValue; //.trim();
  };

  console.log("Version:", d._dilithiumVersion());
  const msg = "TESTING SIGNING WITH CRYSTALS";
  var keyPtr = d._dilithiumGenerate();
  var keyPair = getCString(keyPtr, KEYPAIR_BYTES_B64 * 2, true);

  var jsonKeyPair = JSON.parse(keyPair);
  console.log("Generated Key Pair(JSON):\n", jsonKeyPair);

  var m = toCString(msg);

  var sigPtr = d._dilithiumSign(m, toCString(jsonKeyPair.d));
  var sig = getCString(sigPtr, CRYPTO_BYTES_B64 * 2, true);
  console.log("Signature of:", msg);
  console.log(sig);
  var verified = d._dilithiumVerify(
    toCString(sig),
    m,
    toCString(jsonKeyPair.x)
  );
  console.log("Verified message:", verified);
});
