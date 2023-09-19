const translator = require("./translator");

describe("translator", () => {
  it("should translate a simple HTML string to object", () => {
    const html = '<div id="first-div">Hello, friends</div>';
    const expected = {
      tag: "div",
      text: "Hello, friends",
      id: "first-div",
      children: [],
    };

    const result = translator(html, false);
    expect(result).toEqual(expected);
  });

  it("should handle nested elements correctly", () => {
    const html = "<div><span>Nested</span></div>";
    const expected = {
      tag: "div",
      children: [
        {
          tag: "span",
          text: "Nested",
          children: [],
        },
      ],
    };

    const result = translator(html, false);
    expect(result).toEqual(expected);
  });

  it("should correctly parse style attributes", () => {
    const html = '<div style="color: red; font-size: 12px;"></div>';
    const expected = {
      tag: "div",
      style: {
        color: "red",
        fontSize: "12px",
      },
      children: [],
    };

    const result = translator(html, false);
    expect(result).toEqual(expected);
  });

  it("should correctly parse multiple attributes", () => {
    const html = '<div id="first" class="test"></div>';
    const expected = {
      tag: "div",
      id: "first",
      class: "test",
      children: [],
    };

    const result = translator(html, false);
    expect(result).toEqual(expected);
  });

  it("should handle returnJson flag correctly", () => {
    const html = "<div>Text</div>";
    const expected = JSON.stringify(
      {
        tag: "div",
        text: "Text",
        children: [],
      },
      null,
      2
    );

    const result = translator(html, true);
    expect(result).toEqual(expected);
  });
});
