const di = require("..");

describe("@mesur/dilithium", () => {
  it("should export a default module", () => {
    expect(di._dilithiumVersion).toBeDefined();
    expect(di._dilithiumGenerate).toBeDefined();
    expect(di._dilithiumSign).toBeDefined();
    expect(di._dilithiumVerify).toBeDefined();
    expect(di._dilithiumVerify).toBeDefined();
  });

  it("should generate key", async () => {
    const jwk = await di._dilithiumGenerate();
    console.log(jwk);
  });
});
