import Data from "./Data"

describe("number field", () => {
  let d: Data;
  it("initializes to null and is empty", () => {
    d = new Data({
      type: "field",
      subtype: "number"
    });
    expect(d.entity.number?.value).toBe(null);
    expect(d.entity.number?.empty).toBe(true);
  });

  it("defaults to given value", () => {
    d = new Data({
      type: "field",
      subtype: "number",
      default: 69
    });
    expect(d.entity.number?.value).toBe(69);
    expect(d.entity.number?.empty).toBe(false);
  });

  it("converts given value to make it valid", () => {
    d = new Data<{a: any}>({
      type: "field",
      subtype: "number",
      default: e => e.props.a,
      props: {a: "69"}
    });
    expect(d.entity.number?.value).toBe(69);
  });

  it("is invalid if given value cannot be converted", () => {
    d = new Data<{a: any}>({
      type: "field",
      subtype: "number",
      default: e => e.props.a,
      props: {a: "a"}
    });
    expect(d.entity.number?.value).toBe(NaN);
    expect(d.entity.number?.valid).toBe(false);
  });

  it("can be invalid with a function", () => {
    d = new Data({
      type: "field",
      subtype: "number",
      rules: {
        invalid: (e) => e.value === 69
      }
    });
    expect(d.entity.number).toBeTruthy();
    const f = d.entity.number;
    if (!f) return;
    expect(f.valid).toBe(true);
    f.value = 69;
    expect(f.valid).toBe(false);
  });

  it("can be disabled with a function", () => {
    d = new Data({
      type: "field",
      subtype: "number",
      rules: {
        disabled: (e) => e.value === 69
      }
    });
    expect(d.entity.number?.disabled).toBe(false);
    const f = d.entity.number;
    if (f) f.value = 69;
    expect(d.entity.number?.disabled).toBe(true);
  });

  it("can have a max value", () => {
    d = new Data({
      type: "field",
      subtype: "number",
      rules: {
        max: 3
      },
      default: 5
    });
    const f = d.entity.number;
    expect(f?.schema.subtype).toBe("number");
    if (!f) return;
    expect(f.valid).toBe(false);
    f.value = 3;
    expect(f.valid).toBe(true);

    d = new Data({
      type: "field",
      subtype: "number",
      rules: {
        max: {value: 3, exclusive: true}
      },
      default: 5
    });
    const ff = d.entity.number;
    expect(ff?.schema.subtype).toBe("number");
    if (!ff) return;
    expect(ff.valid).toBe(false);
    ff.value = 3;
    expect(ff.valid).toBe(false);
    ff.value = 2.99;
    expect(ff.valid).toBe(true);
  });

  it("can have a min value", () => {
    d = new Data({
      type: "field",
      subtype: "number",
      rules: {
        min: 3
      },
      default: 2
    });
    const f = d.entity.number;
    expect(f?.schema.subtype).toBe("number");
    if (!f) return;
    expect(f.valid).toBe(false);
    f.value = 3;
    expect(f.valid).toBe(true);

    d = new Data({
      type: "field",
      subtype: "number",
      rules: {
        min: {value: 3, exclusive: true}
      },
      default: 2
    });
    const ff = d.entity.number;
    expect(ff?.schema.subtype).toBe("number");
    if (!ff) return;
    expect(ff.valid).toBe(false);
    ff.value = 3;
    expect(ff.valid).toBe(false);
    ff.value = 3.01;
    expect(ff.valid).toBe(true);
  });

  it("can have a step value that counts from min or 0", () => {
    d = new Data({
      type: "field",
      subtype: "number",
      rules: {
        step: 1,
        min: e => (typeof e.value === "number") ? (e.value > 2 ? 1.1 : 0) : 0
      },
      default: 2
    });
    const f = d.entity.number;
    expect(f?.schema.subtype).toBe("number");
    if (!f) return;
    expect(f.valid).toBe(true);
    f.value = 3;
    expect(f.valid).toBe(false);
    f.value = 3.1;
    expect(f.valid).toBe(true);
  });

  it("can be required", () => {
    d = new Data({
      type: "field",
      subtype: "number",
      rules: {
        required: true
      }
    });
    const f = d.entity.number;
    expect(f?.schema.subtype).toBe("number");
    if (!f) return;
    expect(f.valid).toBe(false);
    f.value = 3;
    expect(f.valid).toBe(true);
  });
});