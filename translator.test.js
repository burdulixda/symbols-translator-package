const translator = require("./translator");
const { JSDOM } = require("jsdom");

const createElement = (html) => new JSDOM(html).window.document.body.firstChild;

describe("translator", () => {
  it("should convert an HTML element with only a tag name", () => {
    const element = createElement("<div></div>");
    expect(translator(element.outerHTML)).toEqual({
      tag: "div",
    });
  });

  it("should convert an HTML element with text content", () => {
    const element = createElement("<div>Text here</div>");
    expect(translator(element.outerHTML)).toEqual({
      tag: "div",
      text: "Text here",
    });
  });

  it("should convert an HTML element with an ID and class", () => {
    const element = createElement('<div id="myId" class="myClass"></div>');
    expect(translator(element.outerHTML)).toEqual({
      tag: "div",
      id: "myId",
      class: "myClass",
    });
  });

  it("should convert an HTML element with style attributes", () => {
    const element = createElement(
      '<div style="color: red; font-size: 16px;"></div>'
    );
    expect(translator(element.outerHTML)).toEqual({
      tag: "div",
      style: {
        color: "red",
        fontSize: "16px",
      },
    });
  });

  it("should convert nested HTML elements", () => {
    const element = createElement("<div><span>Text</span></div>");
    expect(translator(element.outerHTML)).toEqual({
      tag: "div",
      children: [
        {
          tag: "span",
          text: "Text",
        },
      ],
    });
  });
});
