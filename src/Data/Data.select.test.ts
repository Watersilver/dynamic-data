import Data from "./Data"

describe("select field", () => {
  let d: Data;
  it("initializes to empty array and is empty", () => {
    d = new Data({
      type: "field",
      subtype: "select",
      options: [{}, 1, "g", true, null]
    });
    expect(d.entity.select?.value).toEqual([]);
    expect(d.entity.select?.empty).toBe(true);
  });

  it("defaults to given value", () => {
    d = new Data({
      type: "field",
      subtype: "select",
      options: [{}, 1, "g", true, null],
      default: [{}]
    });
    expect(d.entity.select?.value).toEqual([{}]);
    expect(d.entity.select?.empty).toBe(false);
  });

  it("can be invalid with a function", () => {
    d = new Data({
      type: "field",
      subtype: "select",
      options: [{}, 1, "g", true, null],
      rules: {
        invalid: e => e.equals(["g"])
      }
    });
    expect(d.entity.select).toBeTruthy();
    const f = d.entity.select;
    expect(f?.valid).toBe(true);
    f?.set([1]);
    expect(f?.valid).toBe(true);
    f?.set(["g"]);
    expect(f?.valid).toBe(false);
  });

  it("can be disabled with a function", () => {
    d = new Data({
      type: "field",
      subtype: "select",
      options: [{}, 1, "g", true, null],
      rules: {
        disabled: e => e.equals([{}])
      }
    });
    expect(d.entity.select?.disabled).toBe(false);
    const f = d.entity.select;
    if (f) f.value = [{}];
    expect(f?.disabled).toBe(true);
  });

  it("can have a maxselected value", () => {
    d = new Data({
      type: "field",
      subtype: "select",
      options: [{}, 1, "g", true, null],
      rules: {
        maxselected: 2
      },
      default: [{}, 1]
    });
    const f = d.entity.select;
    expect(f?.valid).toBe(true);
    f?.set([{}, 1, "g"]);
    expect(f?.valid).toBe(false);
  });

  it("can have a minselected value", () => {
    d = new Data<{d: any[]}>({
      type: "field",
      subtype: "select",
      options: [{}, 1, "g", true, null],
      rules: {
        minselected: 2
      },
      default: e => e.props.d,
      props: {d: [{}, 1]}
    });
    const f = d.entity.select;
    expect(f?.valid).toBe(true);
    f?.set([1]);
    expect(f?.valid).toBe(false);
  });

  it("can have a fixedselected value", () => {
    d = new Data({
      type: "field",
      subtype: "select",
      options: [{}, 1, "g", true, null],
      rules: {
        fixedselected: 1,
        required: true
      },
      default: ["g"]
    });
    const f = d.entity.select;
    expect(f?.valid).toBe(true);
    f?.set([]);
    expect(f?.valid).toBe(false);
    f?.set([1, "g"]);
    expect(f?.valid).toBe(false);
  });

  it("can be required", () => {
    d = new Data({
      type: "field",
      subtype: "select",
      options: [{}, 1, "g", true, null],
      rules: {
        required: true
      }
    });
    const f = d.entity.select;
    expect(f?.valid).toBe(false);
    f?.set(["g"]);
    expect(f?.valid).toBe(true);
  });
});