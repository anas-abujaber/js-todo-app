var $todoForm = document.querySelector(".todo-form"),
  $todoInput = document.querySelector("#todo-input"),
  $todoList = document.querySelector(".todo-list");

$todoForm.addEventListener("submit", addTodo);

window.addEventListener("DOMContentLoaded", function (e) {
  var todoList = store.getItemsFromLocalStorage();
  todoList.forEach(function (todo) {
    renderListItem(todo);
  });
});

function addTodo(submitEvent) {
  submitEvent.preventDefault();

  var inputValue = $todoInput.value;
  if (!isTodoValid(inputValue)) {
    showErrorMessage("The todo is not valid !");
  };
  renderListItem(inputValue);
  store.saveTodo(inputValue);

  // this here refers to the todo form element
  this.reset();
}

function isTodoValid(value) {
  if (isValueNotEmpty(value) && isValueNotContainsSpecialChars(value)) {
    return true;
  } else {
    return false;
  }


  // var rules = [isValueNotEmpty, isValueNotContainsSpecialChars];

  // for (
  //   let counter = 0, rulesLength = rules.length;
  //   counter < rulesLength;
  //   counter++
  // ) {
  //   if (!rules[counter](value)) {
  //     return false;
  //   }
  // }

  // return true;
}

function isValueNotEmpty(value) {
  if (value.length === 0) {
    // showErrorMessage("Todo can't be empty !");
    return false;
  }

  return true;
}

function isValueNotContainsSpecialChars(value) {
  var specialChars = ["$", "<", ">", "%", "*", "#", "@", "(", ")", "!", "^"];
  for (
    var counter = 0, length = specialChars.length;
    counter < length;
    counter++
  ) {
    if (value.indexOf(specialChars[counter]) > -1) {
      // showErrorMessage("Todo can't contain special characters !");
      return false;
    }
  }

  return true;
}

function showErrorMessage(message) {
  let messageEl = createElement({
    tagName: "p",
    className: "error-message",
    content: message,
  });

  $todoForm.insertAdjacentElement("afterend", messageEl);
  setTimeout(function () {
    document.querySelector(".error-message").remove();
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

function removeListItem(clickEvent) {
  var listItem = clickEvent.target.parentElement;
  store.removeTodo(
    getItemIndexByItsContent(
      listItem.querySelector(".todo-list__item__content").textContent
    )
  );
  listItem.remove();
}

function getItemIndexByItsContent(item) {
  var list = store.getItemsFromLocalStorage(),
    index;
  for (var counter = 0, length = list.length; counter < length; counter++) {
    if (list[counter] === item) {
      index = counter;
      break;
    }
  }

  return index;
}

/**
 * Append element to the document and return that element,
 * so that we can append more elements to that element.
 * If element is array of elements, call the function again on every array element
 */
function appendElement(element, parent) {
  if (Array.isArray(element)) {
    return element.forEach(function (item) {
      appendElement(item, parent);
    });
  }
  parent.append(element);
}

/**
 * Create element with class name and event listener if provided
 * object structure: { tagName: string, className: string, content: string }
 *
 * @param {object} item
 */
function createElement(item) {
  var element = document.createElement(item.tagName);

  if (item.className) {
    element.className = item.className;
  }

  if (item.content) {
    element.innerHTML = item.content;
  }
  return element;
}

// Local storage layer
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
