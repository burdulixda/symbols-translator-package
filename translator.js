const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const htmlStringToJson = (element) => {
  const jsonElement = { tag: element.tagName.toLowerCase() };
  const directTextContent = Array.from(element.childNodes)
    .filter(({ nodeType }) => nodeType === 3)
    .map(({ nodeValue }) => nodeValue.trim())
    .join(" ")
    .trim();

  if (directTextContent) jsonElement.text = directTextContent;
  if (element.id) jsonElement.id = element.id;
  if (element.className) jsonElement.class = element.className;

  const cssText = element.style.cssText;
  if (cssText) {
    const style = Object.fromEntries(
      cssText
        .split(";")
        .filter(Boolean)
        .map((item) => {
          const [key, value] = item.trim().split(": ");
          return [toCamelCase(key), value.replace(/;$/, "")];
        })
    );
    jsonElement.style = style;
  }

  const childElements = Array.from(element.childNodes).filter(
    ({ nodeType }) => nodeType === 1
  );
  if (childElements.length) {
    jsonElement.children = childElements.map(htmlStringToJson);
  }

  return jsonElement;
};

function translator(htmlContent, returnJson = true) {
  const htmlDom = new JSDOM(htmlContent);
  const context = htmlDom.window.document.body.firstChild;
  const output = htmlStringToJson(context);
  return returnJson ? JSON.stringify(output, null, 2) : output;
}

module.exports = translator;
