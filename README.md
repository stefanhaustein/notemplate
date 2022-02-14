# NoTemplate.js

After working on html templating for ~10 years, I think the best template library is no template library.

NoTemplate.js provides only a single function `tag()`. Use nested `tag()` calls to build a DOM tree in pure JS in a concise and safe manner without any special syntax, compiler or preprocessor:

The first parameter is the element name. Each HTML5 element also has a helper function registered on the tag function, so instead of using `tag("p", ...)`, one can also use `tag.p(...)`.

Additional parameters build the content:

- Strings are safely added as text nodes. No need to escape anything.
- DOM Nodes (in particular elements) are added as child nodes.
- Properties of nested plain objects are treated as
  - Attributes where the value is a string
  - Boolean attributes where the value is a boolean (empty string for true, absence otherwise)
  - Event handlers where the value is a function
  - For "style", the value can be an object, which is translated to style properties
  - For "class", the value can be an array
- Arrays are automatically flattened to simplify building from fragments.
- Null values are ignored to simplify handling conditional children

For components, create functions that return elements.

## Use Cases

 - [quotations.ch](https://quotations.ch/quotations)

Let me know if I should add anything here.

## Simple Example

```javascript

document.body.appendChild(
  tag.p(
    "Hello ",
    tag.a({
        href: "#",
        click: event => alert("Hello")},
      "World")));
```

## TodoMVC Implementation

- [Source Code](https://github.com/stefanhaustein/notemplate/blob/master/demo/todomvc/js/app.js) (< 150 LOC; the view code starts around line 56)
- [Live Demo](https://stefanhaustein.github.io/notemplate/demo/todomvc) 
- Should be one of the fastest loading readable / unobfuscated implementations: 

![Developer Tools Network Tab](https://user-images.githubusercontent.com/4282319/70658877-2b2c0f00-1c5f-11ea-87de-ab948f09b10f.png)
