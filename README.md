# NoTemplate.js
NoTemplate.js is not a template library.

It only provides a single function `element()`. Use nested `element()` calls to build a DOM tree in pure JS. 

The first parameter is the element name.

Additional parameters build the content:

- Strings are safely added as text nodes. No need to escape anything.
- DOM Nodes (in particular elements) are added as child nodes.
- Properties of nested plain objects are treated as 
  - Attributes where the value is a string
  - Event handlers where the value is a function
  - For "style", the value can be an object, which is translated to style properties
  - For "class", the value can be an array
- Arrays are automatically flattened to simplify building from fragments.
- Null values are ignored to simplify handling conditional children

For components, create functions that return elements. 

## Trivial Example

```javascript

document.body.appendChild(
  element("p", 
    "Hello ",
    element("a", {
        href: "#",
        click: event => alert("Hello")},
      "World")));
```

## TodoMVC Implementation

- [Source Code](https://github.com/stefanhaustein/notemplate/blob/master/todomvc/js/app.js) (< 150 LOC) 
- [Demo](http://kobjects.org/todomvc/) 

![Developer Tools Network Tab](https://user-images.githubusercontent.com/4282319/70658877-2b2c0f00-1c5f-11ea-87de-ab948f09b10f.png)
