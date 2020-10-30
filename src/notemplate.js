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
function registerElementHelpers(scope, overrideOverwriteScope=true) {
  // List from: https://www.w3.org/TR/html52/fullindex.html#element-interfaces
  const elementNames = 'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rb,rp,rt,rtc,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'.split(',');
  scope = scope || window;
  for (const name of elementNames) {
    if (name in scope && !overrideOverwriteScope) {
      console.warn('Will skip registering function %s on scope, because it already exists', name);
    } else {
      scope[name] = (...content) => element(name, ...content)
    }
  }
  return scope;
}
