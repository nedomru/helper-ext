setTimeout(function () {
  let waiter = document.getElementById("waiter");
  let formForm = document.getElementById("formform");

  // Remove style and event handling attributes from the parent node of "waiter"
  let parent = waiter.parentNode;
  parent.removeAttribute("style");
  parent.removeAttribute("onselectstart");

  // Disable event propagation for "formform"
  formForm.onmousedown = function (event) {
    event.stopPropagation();
  };

  formForm.onselectstart = function (event) {
    event.stopPropagation();
  };

  // Disable event propagation for "waiter"
  waiter.onselectstart = function (event) {
    event.stopPropagation();
  };

  waiter.onmousedown = function (event) {
    event.stopPropagation();
  };
}, 2000);

// Updating innerHTML safely
element.innerHTML = text.replace(textToFind, span.outerHTML);
