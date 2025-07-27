var $todoForm = document.querySelector(".todo-form"),
  $todoInput = document.querySelector("#todo-input"),
  $todoList = document.querySelector(".todo-list");

$todoForm.addEventListener("submit", addTodo);

window.addEventListener("DOMContentLoaded", function () {
  var todoList = store.getItemsFromLocalStorage();
  todoList.forEach(function (todo) {
    renderListItem(todo);
  });
});

function addTodo(e) {
  e.preventDefault();

  var inputValue = $todoInput.value;
  if (!isTodoValid(inputValue)) {
    showErrorMessage("The todo is not valid !");
    return;
  }

  renderListItem(inputValue);
  store.saveTodo(inputValue);
  this.reset();
}

function isTodoValid(value) {
  return isValueNotEmpty(value) && isValueNotContainsSpecialChars(value);
}

function isValueNotEmpty(value) {
  return value.length > 0;
}

function isValueNotContainsSpecialChars(value) {
  var specialChars = ["$", "<", ">", "%", "*", "#", "@", "(", ")", "!", "^"];
  return !specialChars.some((char) => value.includes(char));
}

function showErrorMessage(message) {
  let messageEl = createElement({
    tagName: "p",
    className: "error-message",
    content: message,
  });

  $todoForm.insertAdjacentElement("afterend", messageEl);
  setTimeout(() => {
    document.querySelector(".error-message")?.remove();
  }, 2000);
}

function renderListItem(content) {
  var $listItem = createElement({
      tagName: "li",
      className: "todo-list__item",
    }),
    $listItemContent = createElement({
      tagName: "p",
      className: "todo-list__item__content",
      content: content,
    }),
    $listItemButton = createElement({
      tagName: "button",
      className: "todo-list__item__button",
      content: "x",
    });

  $listItemButton.addEventListener("click", removeListItem);
  appendElement([$listItemContent, $listItemButton], $listItem);
  appendElement($listItem, $todoList);
}

function removeListItem(e) {
  var listItem = e.target.parentElement;
  store.removeTodo(
    getItemIndexByItsContent(
      listItem.querySelector(".todo-list__item__content").textContent
    )
  );
  listItem.remove();
}

function getItemIndexByItsContent(item) {
  var list = store.getItemsFromLocalStorage();
  return list.indexOf(item);
}

function appendElement(element, parent) {
  if (Array.isArray(element)) {
    element.forEach((el) => appendElement(el, parent));
  } else {
    parent.append(element);
  }
}

function createElement(item) {
  var element = document.createElement(item.tagName);
  if (item.className) element.className = item.className;
  if (item.content) element.innerHTML = item.content;
  return element;
}

var store = {
  getItemsFromLocalStorage: function () {
    return JSON.parse(localStorage.getItem("todoItems")) || [];
  },
  saveToLocalStorage: function (todoList) {
    localStorage.setItem("todoItems", JSON.stringify(todoList));
  },
  saveTodo: function (todo) {
    var todoList = this.getItemsFromLocalStorage();
    todoList.push(todo);
    this.saveToLocalStorage(todoList);
  },
  removeTodo: function (index) {
    var todoList = this.getItemsFromLocalStorage();
    todoList.splice(index, 1);
    this.saveToLocalStorage(todoList);
  },
};
