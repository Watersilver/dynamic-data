import Data from "./Data"

describe("string field", () => {
  let d: Data;
  it("initializes to empty string and is empty", () => {
    d = new Data({
      type: "field",
      subtype: "text"
    });
    expect(d.entity.text?.value).toBe("");
    expect(d.entity.text?.empty).toBe(true);
  });

  it("defaults to given value", () => {
    d = new Data({
      type: "field",
      subtype: "text",
      default: "69"
    });
    expect(d.entity.text?.value).toBe("69");
    expect(d.entity.text?.empty).toBe(false);
  });

  it("converts given value to make it valid", () => {
    d = new Data<{a: any}>({
      type: "field",
      subtype: "text",
      default: e => e.props.a,
      props: {a: 69}
    });
    expect(d.entity.text?.value).toBe("69");
  });

  it("can be invalid with a function", () => {
    d = new Data({
      type: "field",
      subtype: "text",
      rules: {
        invalid: (e) => e.value === "69"
      }
    });
    expect(d.entity.text).toBeTruthy();
    const f = d.entity.text;
    if (!f) return;
    expect(f.valid).toBe(true);
    f.value = 69;
    expect(f.valid).toBe(false);
  });

  it("can be disabled with a function", () => {
    d = new Data({
      type: "field",
      subtype: "text",
      rules: {
        disabled: (e) => e.value === "69"
      }
    });
    expect(d.entity.text?.disabled).toBe(false);
    const f = d.entity.text;
    if (f) f.value = 69;
    expect(d.entity.text?.disabled).toBe(true);
  });

  it("can have a maxlength value", () => {
    d = new Data({
      type: "field",
      subtype: "text",
      rules: {
        maxlength: 3
      },
      default: "asda"
    });
    const f = d.entity.text;
    expect(f?.valid).toBe(false);
    f?.set("asd");
    expect(f?.valid).toBe(true);
  });

  it("can have a minlength value", () => {
    d = new Data({
      type: "field",
      subtype: "text",
      rules: {
        minlength: 3
      },
      default: "asd"
    });
    const f = d.entity.text;
    expect(f?.valid).toBe(true);
    f?.set("as");
    expect(f?.valid).toBe(false);
  });

  it("can have a pattern", () => {
    d = new Data({
      type: "field",
      subtype: "text",
      rules: {
        pattern: "^a"
      },
      default: "b"
    });
    const f = d.entity.text;
    expect(f?.valid).toBe(false);
    f?.set("ab");
    expect(f?.valid).toBe(true);
  });

  it("can be required", () => {
    d = new Data({
      type: "field",
      subtype: "text",
      rules: {
        required: true
      }
    });
    const f = d.entity.text;
    expect(f?.valid).toBe(false);
    f?.set("yup");
    expect(f?.valid).toBe(true);
  });
});