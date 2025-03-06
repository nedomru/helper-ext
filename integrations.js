function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

async function handleSocketMessages(data) {
  // ...existing code...

  if (GENESYS_showLineMessages && data.messageText) {
    const cleanMessage = stripHtml(data.messageText);
    console.log(cleanMessage);
    
    // Configure notification styling
    $.notify.defaults({
      style: 'bootstrap',
      elementPosition: 'right',
      globalPosition: 'top right',
      className: 'info',
      autoHideDelay: 5000
    });

    // Add custom CSS for notifications
    $("<style>")
      .prop("type", "text/css")
      .html(`
        .notifyjs-bootstrap-base {
          max-width: 400px !important;
          white-space: normal !important;
          word-wrap: break-word !important;
        }
        .notifyjs-bootstrap-base .notify-title {
          font-weight: bold;
          margin-bottom: 5px;
          display: block;
        }
      `)
      .appendTo("head");

    $.notify({
      title: data.authorName,
      message: cleanMessage
    }, {
      template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<span class="notify-title">{1}</span>' +
        '<span data-notify="message">{2}</span>' +
        '</div>'
    });
  }
}
