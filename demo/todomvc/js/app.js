(function (window) {
  'use strict';

  // Model

  let currentFilter = "";  // Not part of the persistent state.
  let state = JSON.parse(localStorage.getItem("state")) ||
      { text: "", items: []};

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

  function render() {
    document.getElementsByClassName("todoapp")[0].replaceWith(
      tag.section({class: "todoapp"},
        tag.header({class: "header"},
          tag.h1("todos"),
          tag.form({submit: event => addItem(event)},
            tag.input({
                class: "new-todo",
                autofocus: true,
                placeholder: "What needs to be done?",
                change: event => state.text = event.target.value}))),
        renderMain(),
        renderFooter()));
  }

  function renderMain() {
    return state.items.length == 0 ? null :
      tag.section({class: "main"},
        tag.input({
            id: "toggle-all",
            class: "toggle-all",
            checked: countOpenItems() == 0,
            type: "checkbox",
            click: event => setAll(event.target.checked)}),
        tag.label({for: "toggle-all"}, "Mark all as complete"),
        renderTodoList(state.items));
  }

  function renderFooter() {
    return state.items.length == 0 ? null :
      tag.footer({class: "footer"},
        tag.span({class: "todo-count"},
          tag.strong(countOpenItems()), " items left"),
        tag.ul({class: "filters"},
           [["All", ""], ["Active", "active"], ["Completed", "completed"]].map(([label, key]) =>
            tag.li(tag.a({
                href: "#/" + key,
                class: currentFilter == key ? "selected" : ""},
              label)))));
  }

  function renderTodoList() {
    return tag.ul({class: "todo-list"}, state.items.map((item, index) => renderItem(item, index)));
  }

  function renderItem(item, index) {
    if (currentFilter == (item.completed ? "active" : "completed")) {
      return null;
    }
    return tag.li((item.completed ? {class: "completed"} : null), {
        dblclick: event => {
          let li = event.target.closest("li");
          li.classList.add("editing");
          li.querySelector(".edit").focus();
        }},
      tag.div({class: "view"},
        tag.input({
            class: "toggle",
            type: "checkbox",
            checked: item.completed,
            change: () => toggleItem(index)}),
        tag.label(item.text),
        tag.button({class: "destroy"}, () => destroyItem(index))),
      tag.input({
        class: "edit",
        value: item.text,
        change: e => {
          item.text = e.target.value;
          saveState()
        },
        blur: render}));
  }
  updateFilter();
})(window);
