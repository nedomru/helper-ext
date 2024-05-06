setTimeout(function () {
  document.getElementById("waiter").parentNode.removeAttribute("style");
  document.getElementById("waiter").parentNode.removeAttribute("onselectstart");

  document.getElementById("waiter").onselectstart = function (event) {
    event.stopPropagation();
  };

  document.getElementById("waiter").onmousedown = function (event) {
    event.stopPropagation();
  };

  document.getElementById("formform").onmousedown = function (event) {
    event.stopPropagation();
  };
  document.getElementById("formform").onselectstart = function (event) {
    event.stopPropagation();
  };
}, 2000);
