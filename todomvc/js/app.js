(function (window) {
  'use strict';

  // Model

  let currentFilter = "";  // Not part of the persistent state.
  let state = JSON.parse(localStorage.getItem("state")) || {
    text: "",
    items: [],
  };

  // Controller

  window.onhashchange = updateFilter;

  function countOpenItems() {
    let result = 0;
    state.items.forEach(item => result += item.completed ? 0 : 1);
    return result;
  }

  function updateFilter() {
    currentFilter = window.location.hash.substr(2);
    render();
  }

  function addItem(event) {
    event.preventDefault();
    state.items.push({text: state.text});
    update();
    document.querySelector(".new-todo").focus();
  }

  function toggleItem(index) {
    state.items[index].completed = !state.items[index].completed;
    update();
  }

  function destroyItem(index) {
    state.items.splice(index, 1);
    update();
  }

  function saveState() {
    localStorage.setItem("state", JSON.stringify(state));
  }

  function update() {
    saveState();
    render();
  }

  function setAll(completed) {
    state.items.forEach(item => item.completed = completed);
    update();
  }

  // View

  function renderTodoList() {
    return element("ul", {class: "todo-list"}, state.items.map((item, index) => renderItem(item, index)));
  }

  function renderItem(item, index) {
    if (currentFilter == (item.completed ? "active" : "completed")) {
      return null;
    }
    return element("li",
      (item.completed ? {"class": "completed"} : null),
      {dblclick: event => {
          let li = event.target.closest("li");
          li.classList.add("editing");
          li.querySelector(".edit").focus();
      }},
       element("div", {"class": "view"},
        element("input", {
          class: "toggle",
          type: "checkbox",
          checked: item.completed ? "checked" : null,
          change: () => toggleItem(index)}),
        element("label", item.text),
        element("button", {"class": "destroy"}, () => destroyItem(index))),
      element("input", {
        class: "edit",
        value: item.text,
        change: e => {
          item.text = e.target.value;
          saveState()
        },
        blur: render}));
  }

  function renderMain() {
    return state.items.length == 0 ? null :
      element("section", {class: "main"},
        element("input", {
            id: "toggle-all",
            class: "toggle-all",
            checked: countOpenItems() == 0 ? "checked" : null,
            type: "checkbox",
            click: event => setAll(event.target.checked)}),
        element("label", {for: "toggle-all"}, "Mark all as complete"),
        renderTodoList(state.items));
  }

  function renderFooter() {
    return state.items.length == 0 ? null :
      element("footer", {class: "footer"},
        element("span", {class: "todo-count"},
          element("strong", countOpenItems()),
          " items left"),
        element("ul",
          {class: "filters"},
           [["All", ""], ["Active", "active"], ["Completed", "completed"]].map(([label, key]) =>
            element("li",
              element("a", {
                href: "#/" + key,
                class: currentFilter == key ? "selected" : ""},
              label)))));
  }


  function render() {
    document.getElementsByClassName("todoapp")[0].replaceWith(
      element("section", {"class": "todoapp"},
        element("header", {"class": "header"},
          element("h1", "todos"),
          element("form", {submit: event => addItem(event)},
            element("input", {
              class: "new-todo",
              autofocus: "autofocus",
              placeholder: "What needs to be done?",
              change: event => state.text = event.target.value}))),
        renderMain(),
        renderFooter()));
  }

  updateFilter();

})(window);
