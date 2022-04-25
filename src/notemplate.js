(function(global) {

  function RawHtml(innerHTML) {
    this.innerHTML = innerHTML;
  }

  function tag(name, ...content) {
    if (Array.isArray(name) && name.raw) {
      //TODO: oops, fails, list should be inside RawHtml-object.
      let result = [RawHtml(name[0])];
      for(let i=1; i<name.length; i++) {
        result.push(content[i-1]);
        result.push(name[i]);
      }
      return result;
    }
    let element = document.createElement(name);
    let children = content.flat(Infinity);
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      switch (typeof child) {
        case 'object':
          if (child instanceof Node) {
            element.appendChild(child);
          } else if (child instanceof RawHtml) {
            element.innerHTML += child.innerHTML;
          } else if (child != null) {
            for (let key in child) {
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
                  for (let propertyName in value) {
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

  // List from: https://www.w3.org/TR/html52/fullindex.html#element-interfaces
  tag.tagNames = 'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,slot,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'.split(',');

  for (const name of tag.tagNames) {
    tag[name] = (...content) => tag(name, ...content)
  }
  tag.RAW = (innerHTML) => {
    return new RawHtml(innerHTML)
  }
  // function element as a (deprecated) synonym for tag for now for compatibility
  function element(...content) {
    const code = 'font-family:monospace;font-weight:bold', reset = 'font-family:unset;font-weight:unset';
    console.warn('The %celement%c-function is deprecated; please use %ctag%c instead.', code, reset, code, reset)
    return tag(...content);
  }

  // Export
  global.tag = tag;
  global.element = element;

})(window);

