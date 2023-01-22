import { EntitySchema } from "../schema";
import Data from "./Data"

describe("Data", () => {

  it("compiles", () => {
    const d1 = new Data<{prop1: number}>({
      type: "field",
      subtype: "number"
    });

    d1.entity.schema.props?.prop1
    d1.entity.group?.schema.props?.prop1
    d1.entity.list?.schema.props?.prop1
    d1.entity.text?.schema.props?.prop1
    d1.entity.number?.schema.props?.prop1
    d1.entity.select?.schema.props?.prop1
    d1.entity.group?.contents.a?.schema.props?.prop1
    d1.entity.group?.contents.a?.group?.schema.props?.prop1
    d1.entity.group?.contents.a?.list?.schema.props?.prop1
    d1.entity.group?.contents.a?.number?.schema.props?.prop1
    d1.entity.group?.contents.a?.text?.schema.props?.prop1
    d1.entity.group?.contents.a?.select?.schema.props?.prop1
    d1.entity.list?.items[0]?.schema.props?.prop1
    d1.entity.list?.items[0]?.group?.schema.props?.prop1
    d1.entity.list?.items[0]?.list?.schema.props?.prop1
    d1.entity.list?.items[0]?.number?.schema.props?.prop1
    d1.entity.list?.items[0]?.text?.schema.props?.prop1
    d1.entity.list?.items[0]?.select?.schema.props?.prop1
    let e1 = d1.entity.list?.items[0]
    e1 = e1?.tread()
    e1 = e1?.tread("a.b")
    e1 = e1?.tread(["a", "b"])
    e1 = e1?.container;

    const d2 = new Data<{common: string; data: number}, {common: string; group: number}, {common: string; list: number}, {common: string; text: number}, {common: string; number: string}, {common: string; select: number}>({
      type: "field",
      subtype: "number"
    });

    d2.entity.schema.props?.common
    d2.entity.group?.schema.props?.group
    d2.entity.list?.schema.props?.list
    d2.entity.text?.schema.props?.text
    d2.entity.number?.schema.props?.number
    d2.entity.select?.schema.props?.select
    d2.entity.group?.contents.a?.schema.props?.common
    d2.entity.group?.contents.a?.group?.schema.props?.group
    d2.entity.group?.contents.a?.list?.schema.props?.list
    d2.entity.group?.contents.a?.number?.schema.props?.number
    d2.entity.group?.contents.a?.text?.schema.props?.text
    d2.entity.group?.contents.a?.select?.schema.props?.select
    d2.entity.list?.items[0]?.schema.props?.common
    d2.entity.list?.items[0]?.group?.schema.props?.group
    d2.entity.list?.items[0]?.list?.schema.props?.list
    d2.entity.list?.items[0]?.number?.schema.props?.number
    d2.entity.list?.items[0]?.text?.schema.props?.text
    d2.entity.list?.items[0]?.select?.schema.props?.select
    let e2 = d2.entity.list?.items[0]
    e2 = e2?.tread()
    e2 = e2?.tread("a.b")
    e2 = e2?.tread(["a", "b"])
    e2 = e2?.container;

    expect(1).toBe(1);
  })

  const d = new Data({
    type: "group",
    contents: {
      a: {
        type: "field",
        subtype: "number"
      },
      b: {
        type: "field",
        subtype: "number",
        rules: {
          requires: ["a"]
        }
      },
      c: {
        type: "field",
        subtype: "number",
        rules: {
          requires: [["a"], "not exists"]
        }
      },
      d: {
        type: "field",
        subtype: "number"
      },
      e: {
        type: "field",
        subtype: "number"
      },
      f: {
        type: "field",
        subtype: "number",
        rules: {
          requires: { requirements: [["a"], ["d"]], discriminator: "allOf" }
        }
      },
      complex: {
        type: "group",
        contents: {
          a: {
            type: "field",
            subtype: "text"
          },
          req1: {
            type: "field",
            subtype: "text",
            rules: {
              requires: {
                requirements: [
                  [["a"], "includes", 3],
                  {
                    requirements: [
                      [["d"], "includes", 3],
                      [["e"], "includes", 4]
                    ],
                    discriminator: "anyOf"
                  },
                  [["complex", "a"], "is included in", "yo mama"]
                ],
                discriminator: "allOf"
              }
            }
          }
        }
      },
      group: {
        type: "group",
        contents: {
          a: {
            type: "field",
            subtype: "number"
          },
          b: {
            type: "group",
            contents: {
              a: {
                type: "field",
                subtype: "number"
              },
              b: {
                type: "list",
                items: {
                  type: "field",
                  subtype: "text"
                }
              }
            }
          }
        }
      },
      list: {
        type: "list",
        items: {
          type: "group",
          contents: {
            a: {
              type: "field",
              subtype: "number"
            },
            b: {
              type: "field",
              subtype: "text"
            },
            c: {
              type: "field",
              subtype: "select",
              options: ["yooga", ["erty"]]
            },
            d: {
              type: "group",
              contents: {
                a: {
                  type: "field",
                  subtype: "number"
                }
              }
            }
          }
        }
      },
      req2: {
        type: "group",
        contents: {
          a: {
            type: "field",
            subtype: "number"
          }
        },
        rules: {
          requires: [
            ["group"],
            "exists"
          ]
        }
      },
      req3: {
        type: "group",
        contents: {
          a: {
            type: "field",
            subtype: "number"
          }
        },
        rules: {
          requires: [
            ["group"],
            "includes",
            {
              a: 4,
              b: {b: ["a"]}
            }
          ]
        }
      }
    }
  });
  it("can be cleared", () => {
    d.entity.group?.contents.a?.set(1);
    d.entity.group?.contents.d?.set(2);
    expect(d.entity.value).toEqual({a: 1, d: 2});
    d.entity.clear();
    expect(d.entity.value).toEqual({});
    d.entity.group?.set({a: 1, d: 2});
    expect(d.entity.value).toEqual({a: 1, d: 2});
    d.entity.clear();
    expect(d.entity.value).toEqual({});
  });
  it("treads paths", () => {
    d.entity.clear();
    expect(d.entity.group?.contents.a).toBe(d.tread("a"));
    expect(d.entity.group?.contents.a).toBe(d.tread(["a"]));
    expect(d.entity.group?.contents.complex?.group?.contents.req1).toBe(d.tread("complex.req1"));
    expect(d.entity.group?.contents.complex?.group?.contents.req1).toBe(d.tread(["complex", "req1"]));
    d.entity.group?.contents.list?.set([{d: {a: 1}}]);
    expect(d.entity.group?.contents.list?.list?.items[0]).toBe(d.tread("list.0"));
    expect(d.entity.group?.contents.list?.list?.items[0]).toBe(d.tread(["list", 0]));
    expect(d.entity.group?.contents.list?.list?.items[0]).toBeTruthy();
    const b = d.tread("group.b");
    expect(b?.tread()).toBe(b);
    expect(b?.tread("b")).toBe(b?.group?.contents.b);
    expect(b?.tread("b")).toBeTruthy();
    expect(b?.tread(2)).toBe(d.entity);
    expect(b?.tread(2, ["group"])).toBe(b?.tread(1));
    expect(b?.tread(2, "group.a")).toBe(b?.container?.group?.contents.a);
    expect(b?.tread(2, "group.a")).toBeTruthy();
  });
  it("can have simple requirements", () => {
    d.entity.clear();
    const e = d.entity.group?.contents;
    expect(e?.b?.disabled).toBe(true);
    expect(e?.c?.disabled).toBe(false);
    e?.a?.set(3);
    expect(e?.b?.disabled).toBe(false);
    expect(e?.c?.disabled).toBe(true);
  });
  it("can have more complex requirements", () => {
    d.entity.clear();
    const e = d.entity.group?.contents;
    expect(e?.f?.disabled).toBe(true);
    e?.a?.set(1);
    expect(e?.f?.disabled).toBe(true);
    e?.d?.set(1);
    expect(e?.f?.disabled).toBe(false);
    d.entity.clear();
    const r1 = d.entity.group?.contents.complex?.group?.contents.req1;
    expect(r1?.disabled).toBe(true);
    e?.a?.set(3);
    e?.d?.set(3);
    e?.complex?.group?.contents.a?.set("o mam");
    expect(r1?.disabled).toBe(false);
  });
  it("sets list and group values correctly", () => {
    d.entity.clear();
    const l = d.entity.group?.contents.list?.list;
    l?.set([
      {
        a: 1
      }, {
        a: 2,
        b: "b"
      }, {
        a: 3,
        b: "c",
        c: [["erty"]],
        d: {a: 5}
      }
    ]);
    expect(l?.valid).toBe(true);
    expect(l?.empty).toBe(false);
    expect(l?.value).toEqual([
      {
        a: 1
      }, {
        a: 2,
        b: "b"
      }, {
        a: 3,
        b: "c",
        c: [["erty"]],
        d: {a: 5}
      }
    ]);
    expect(d.entity.group?.contents.req2?.disabled).toBe(true);
    expect(d.entity.group?.contents.req3?.disabled).toBe(true);
    d.entity.group?.contents.group?.set({
      a: 3,
      b: {
        b: ["a", "b"]
      }
    });
    expect(d.entity.group?.contents.req2?.disabled).toBe(false);
    expect(d.entity.group?.contents.group?.value).toEqual({
      a: 3,
      b: {
        b: ["a", "b"]
      }
    });
    expect(d.entity.group?.contents.req3?.disabled).toBe(true);
    d.entity.group?.contents.group?.set({
      a: 5,
      b: {
        b: ["a", "b"]
      }
    });
    expect(d.entity.group?.contents.req3?.disabled).toBe(false);
  });
  it("can have default values; specific override general", () => {
    const data = new Data({
      type: "group",
      contents: {
        a: {type: "field", subtype: "number", default: 5},
        b: {type: "field", subtype: "number", default: 3}
      },
      default: {a: 2, b: 5}
    });
    expect(data.entity.value).toEqual({a: 5, b: 3});
  });
  describe("Errors", () => {
    const d = new Data({
      type: "group",
      contents: {
        group: {
          type: "group",
          contents: {
            list: {
              type: "list",
              items: {
                type: "group",
                contents: {
                  a: {
                    type: "field",
                    subtype: "number",
                    rules: {
                      step: 1
                    }
                  },
                  b: {
                    type: "field",
                    subtype: "text",
                    rules: {
                      pattern: "geno",
                      minlength: 5
                    }
                  },
                  c: {
                    type: "field",
                    subtype: "select",
                    options: [true, false],
                    rules: {
                      minselected: 2
                    }
                  },
                  d: {
                    type: "field",
                    subtype: "number"
                  }
                }
              },
              rules: {
                minitems: 2
              }
            }
          },
          rules: {
            invalid: e => !!e.data.tread("group.list.0.d")?.empty
          }
        }
      }
    });
    test("non required entities are valid even if specific rules fail but general invalid rule overrides", () => {
      expect(d.entity.errors).toEqual({contents: {group: {invalid: true}}});
      expect(d.tread("group")?.errors).toEqual({invalid: true});
    });
    test("marks errors correctly", () => {
      d.tread("group.list")?.set([{d: 1.1}, {}]);
      expect(d.tread()?.errors).toEqual(undefined);
      expect(d.tread("group")?.errors).toEqual(undefined);
      d.tread("group.list")?.set([{
        a: 1,
        b: "geno",
        c: [true, false]
      }, {
        a: 1.2,
        b: "gero",
        c: [true]
        }
      ]);
      expect(d.tread()?.errors).toEqual({
        contents: {
          group: {
            invalid: true,
            contents: {
              list: {
                items: [
                  {
                    contents: {
                      b: {minlength: true}
                    }
                  },
                  {
                    contents: {
                      a: {step: true},
                      b: {pattern: true, minlength: true},
                      c: {minselected: true}
                    }
                  }
                ]
              },
            }
          }
        }
      });
      d.tread("group.list")?.set([{
        a: 1,
        b: "papageno",
        c: [true, false],
        d: 69
      }, {
        a: 2,
        b: "gerogeno",
        c: [false, true]
        }
      ]);
      expect(d.tread()?.errors).toBe(undefined);
    });
  });
  describe("callbacks", () => {
    let ents = 0;
    let changes = 0;
    const d: EntitySchema = {
      type: "group",
      contents: {
        a: {
          type: "group",
          contents: {
            a: {
              type: "field",
              subtype: "number"
            },
            b: {
              type: "list",
              items: {
                type: "field",
                subtype: "number"
              }
            }
          }
        },
        b: {
          type: "field",
          subtype: "select",
          options: [{}, []]
        },
        c: {
          type: "field",
          subtype: "text"
        }
      }
    }

    it("runs callback for every field change", () => {
      const data = new Data(d, {
        onFieldChange() {
          changes++;
        }
      });
      expect(changes).toBe(0);
      data.tread("a.a")?.clear();
      data.tread("a.a")?.set(5);
      data.tread("a.a")?.set(5);
      data.tread("a.a")?.set({});
      data.tread("a.a")?.set({});
      data.tread("a.a")?.set("invalid");
      data.tread("a.a")?.set(2);
      expect(changes).toBe(3);
      data.tread("b")?.clear();
      data.tread("b")?.set(5);
      data.tread("b")?.set(5);
      data.tread("b")?.set({});
      data.tread("b")?.set({});
      data.tread("b")?.set("invalid");
      data.tread("b")?.set(2);
      data.tread("b")?.set([{}]);
      expect(changes).toBe(5);
      data.tread("c")?.clear();
      data.tread("c")?.set(5);
      expect(changes).toBe(6);
      data.tread("c")?.set(5);
      data.tread("c")?.set({});
      expect(changes).toBe(7);
      data.tread("c")?.set({});
      data.tread("c")?.set("invalid");
      expect(changes).toBe(8);
      data.tread("c")?.set(2);
      expect(changes).toBe(9);
      data.tread("c")?.set([{}]);
      expect(changes).toBe(10);
      data.tread("c")?.set({a: 2});
      expect(changes).toBe(10);
      data.entity.set({
        a: {
          a: 69,
          b: [1,2]
        },
        b: [[], {}],
        c: "c"
      });
      expect(changes).toBe(15);
    });

    it("runs callback for every constructed entity", () => {
      const data = new Data(d, {
        onEntityConstruct() {
          ents++;
        }
      });
      expect(ents).toBe(6);
      data.tread("a.b")?.set([1,3,4,5]);
      expect(ents).toBe(10);
    });

    it("does not run change events for default values", () => {
      changes = 0;
      new Data({
        type: "group",
        contents: {
          a: {type: "field", subtype: "number", default: 5},
          b: {type: "field", subtype: "number", default: 3}
        },
        default: {a: 2, b: 5}
      }, {
        onFieldChange() {
          changes++;
        }
      });
      expect(changes).toBe(0);
    });
  });
});
