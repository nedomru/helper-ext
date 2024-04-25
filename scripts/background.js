setTimeout(function () {
  document.getElementById("waiter").parentNode.removeAttribute("style");
  document.getElementById("waiter").parentNode.removeAttribute("onselectstart");
  document.getElementById("form").onmousedown = function (event) {
    event.stopPropagation();
  };
  document.getElementById("form").onselectstart = function (event) {
    event.stopPropagation();
  };

  document.getElementById("waiter").onselectstart = function (event) {
    event.stopPropagation();
  };

  document.getElementById("waiter").onmousedown = function (event) {
    event.stopPropagation();
  };
}, 2000);
