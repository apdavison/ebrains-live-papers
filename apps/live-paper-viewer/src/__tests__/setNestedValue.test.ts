import { setNestedValue } from "../BlueNaaS";

describe("setNestedValue", () => {
  it("sets a top-level key", () => {
    const obj = { tstop: 200 };
    const result = setNestedValue(obj, "tstop", 500);
    expect(result).toEqual({ tstop: 500 });
  });

  it("sets a nested dot path", () => {
    const obj = { soma: { gbar_kmb: 0.005, gcanbar_can: 0.6 } };
    const result = setNestedValue(obj, "soma.gbar_kmb", 0.01);
    expect(result).toEqual({ soma: { gbar_kmb: 0.01, gcanbar_can: 0.6 } });
  });

  it("sets an array index path (brackets are expanded to dot notation)", () => {
    const obj = { stim: { 0: { amp: 0.03 } } };
    const result = setNestedValue(obj, "stim[0].amp", 0.05);
    expect(result).toEqual({ stim: { 0: { amp: 0.05 } } });
  });

  it("creates intermediate objects when path doesn't exist", () => {
    const obj = {};
    const result = setNestedValue(obj, "a.b.c", 42);
    expect(result).toEqual({ a: { b: { c: 42 } } });
  });

  it("returns a new object without mutating the original", () => {
    const obj = { soma: { gbar_kmb: 0.005 } };
    const result = setNestedValue(obj, "soma.gbar_kmb", 0.01);
    expect(obj.soma.gbar_kmb).toBe(0.005);
    expect(result).not.toBe(obj);
  });

  it("works with a real config path from solinas (panel.nBPAP)", () => {
    const obj = {
      panel: { nBPAP: 1, nstim: 70, FUNCTIONS: ["set_pulse()"] },
      tstop: 250,
    };
    const result = setNestedValue(obj, "panel.nBPAP", 4);
    expect(result).toEqual({
      panel: { nBPAP: 4, nstim: 70, FUNCTIONS: ["set_pulse()"] },
      tstop: 250,
    });
  });
});
