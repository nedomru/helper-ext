setTimeout(() => {
  const waiter = document.getElementById("waiter");
  if (!waiter) return; // Проверка на наличие waiter

  const { parentNode: parent } = waiter;
  parent.style = "";
  parent.onselectstart = "";

  const formform = document.getElementById("formform");
  if (!formform) return; // Проверка на наличие formform

  [waiter, formform].forEach((el) => {
    el.onmousedown = el.onselectstart = (event) => event.stopPropagation();
  });
}, 2000);
