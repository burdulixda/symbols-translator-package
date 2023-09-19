function parseAttributes(str) {
  const attributes = {};
  str
    .trim()
    .split(/\s+/)
    .forEach((attr) => {
      const [key, value] = attr.split("=");
      if (key && value) {
        attributes[key] = value.replace(/['"]/g, "");
      }
    });
  return attributes;
}

function parseStyle(styleStr) {
  const styles = {};
  styleStr.split(";").forEach((style) => {
    const [key, value] = style.split(":");
    if (key && value) {
      styles[key.trim()] = value.trim();
    }
  });
  return styles;
}

function translator(html, returnJson = true) {
  const stack = [];
  let currentObject = { children: [] };

  html.replace(/<([^>]+)>|([^<]+)/g, (_, tag, text) => {
    if (text) {
      currentObject.text = text.trim();
    } else if (tag.startsWith("/")) {
      currentObject = stack.pop();
    } else {
      const newObject = { children: [] };
      const [tagName, ...attrs] = tag.split(/\s+/);

      newObject.tag = tagName;

      attrs.forEach((attr) => {
        if (attr.startsWith("style")) {
          const [, styleStr] = attr.split("=");
          newObject.style = parseStyle(styleStr.replace(/['"]/g, ""));
        } else if (attr.includes("=")) {
          const { id, class: className } = parseAttributes(attr);
          if (id) newObject.id = id;
          if (className) newObject.class = className;
        }
      });

      if (currentObject) {
        currentObject.children.push(newObject);
        stack.push(currentObject);
      }

      currentObject = newObject;
    }

    return "";
  });

  const output =
    currentObject.children.length > 0
      ? currentObject.children[0]
      : currentObject;

  return returnJson ? JSON.stringify(output, null, 2) : output;
}

module.exports = translator;
