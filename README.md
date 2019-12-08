# NoTemplate.js
NoTemplate is not a template library.

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

## Example

```javascript

document.body.appendChild(
  element("p", 
    "Hello ",
    element("a", {
        href: "#",
        click: event => alert("Hello")},
      "World")));
```

## Live Demo

[TodoMVC in < 150 LOC](http://kobjects.org/todomvc/) 
