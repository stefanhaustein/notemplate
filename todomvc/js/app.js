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

	/*
	<ul class="todo-list">
		<!-- These are here just to show the structure of the list items -->
		<!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
		<li class="completed">
			<div class="view">
				<input class="toggle" type="checkbox" checked>
				<label>Taste JavaScript</label>
				<button class="destroy"></button>
			</div>
			<input class="edit" value="Create a TodoMVC template">
		</li>
		<li>
			<div class="view">
				<input class="toggle" type="checkbox">
				<label>Buy a unicorn</label>
				<button class="destroy"></button>
			</div>
			<input class="edit" value="Rule the web">
		</li>
	</ul>

	*/

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

/*
<!-- This should be `0 items left` by default -->
<span class="todo-count"><strong>0</strong> item left</span>
<!-- Remove this if you don't implement routing -->
<ul class="filters">
	<li>
		<a class="selected" href="#/">All</a>
	</li>
	<li>
		<a href="#/active">Active</a>
	</li>
	<li>
		<a href="#/completed">Completed</a>
	</li>
</ul>
<!-- Hidden if no completed items are left ↓ -->
<button class="clear-completed">Clear completed</button>
*/


	function render() {

		console.log("currentFitler: ", currentFilter);
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

/*


	<section class="todoapp">
		<header class="header">
			<h1>todos</h1>
			<input class="new-todo" placeholder="What needs to be done?" autofocus>
		</header>
		<!-- This section should be hidden by default and shown when there are todos -->
		<section class="main">
			<input id="toggle-all" class="toggle-all" type="checkbox">
			<label for="toggle-all">Mark all as complete</label>
		</section>
		<!-- This footer should hidden by default and shown when there are todos -->
		<footer class="footer">
			<!-- This should be `0 items left` by default -->
			<span class="todo-count"><strong>0</strong> item left</span>
			<!-- Remove this if you don't implement routing -->
			<ul class="filters">
				<li>
					<a id="filter-all" class="selected" href="#/">All</a>
				</li>
				<li>
					<a href="#/active">Active</a>
				</li>
				<li>
					<a href="#/completed">Completed</a>
				</li>
			</ul>
			<!-- Hidden if no completed items are left ↓ -->
			<button class="clear-completed">Clear completed</button>
		</footer>

*/

})(window);
