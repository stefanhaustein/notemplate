function element(name, ...content) {
  let element = document.createElement(name);
  let children = content.flat(Infinity);
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    switch (typeof child) {
      case 'object':
        if (child instanceof Node) {
          element.appendChild(child);
        } else if (child != null) {
          for (key in child) {
            let value = child[key];
            if (key == "class") {
              let names = Array.isArray(value) ? value.flat(Infinity) : value.split(' ');
              for (let j = 0; j < names.length; j++) {
                if (names[j] != null && names[j] != "") {
                  element.classList.add(names[j]);
                }
              }
            } else if (key == "style") {
              if (typeof value == 'object') {
                for (propertyName in value) {
                  element.style.setProperty(propertyName, value[propertyName]);
                }
              } else {
                let css = element.style.cssText;
                element.style.cssText = css + (css == "" || css.endsWith(";")) ? value : (";" + value);
              }
            } else if (typeof value == 'function') {
              element.addEventListener(key, value);
            } else if (typeof value == 'boolean') {
              if (value) {
                element.setAttribute(key, '');
              }
            } else if (value != null) {
              element.setAttribute(key, value);
           }
         }
       }
       break;
      case 'function':
        element.addEventListener('click', child);
        break;
      case 'undefined':
        break;
      default:
        element.appendChild(document.createTextNode(child));
    }
  }
  return element;
}
