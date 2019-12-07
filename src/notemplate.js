
function addAll(element, children) {
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    switch (typeof child) {
      case 'object':
        if (child instanceof Node) {
          element.appendChild(child);
        } else if (Array.isArray(child)) {
          addAll(element, child);
        } else {
          let keys = Object.keys(child);
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = child[key];
            if (typeof value == 'function') {
              element.addEventListener(key, value);
            } else if (value != null) {
              element.setAttribute(key, value);
           }
         }
       }
       break;
      case 'function':
        element.addEventListener('click', child);
        break;
      default:
        element.appendChild(document.createTextNode(child));
    }
  }
  return element;
}

function element(name, ...content) {
  return addAll(document.createElement(name), content);
}
