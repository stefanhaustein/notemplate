# NoTemplate.js

After working on html templating for ~10 years, I think the best template library is no template library.

NoTemplate.js provides only two functions, `tag()` and `raw()`. Use nested `tag()` calls to build a DOM tree in pure JS in a concise and safe manner without any special syntax, compiler or preprocessor; `raw()` can be used to mark "safe" raw HTML content that won't be escaped.

The first parameter of `tag()` is the element name. Each HTML5 element also has a helper function registered on the tag function, so instead of using `tag("p", ...)`, one can also use `tag.p(...)`.

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



## Is this a Joke?

As much as [vanilla.js](http://vanilla-js.com/): I am using this myself for [quotations.ch](https://quotations.ch/quotations) to simplify "old-school" HTML 
construction from JavaScript, replacing direct use of the DOM API. For larger projects, it might make more sense to use something
like vue.js to decouple rendering and state management. I hope this project might help people to "get going" with small projects without
pulling in half the world as dependencies.

## Use Cases

 - [quotations.ch](https://quotations.ch/quotations)
 - [Integer Exposed Rewrite](https://blog.zanstra.com/ict/2023/05/03/integer-exposed-rewrite.html)

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
