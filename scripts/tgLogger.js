TOKEN = "6895822426:AAHLPaxpMl6BfnVdAUwya5RrYY623aih7Wc";
LOG_CHANNEL_ID = -1002176829503;

function sendLog(type, extClass, extFunction, message, agreement = "") {
  logTypeEmoji = "";
  if (type == "INFO") logTypeEmoji = "📜";
  else if (type == "ERROR") logTypeEmoji = "❌";
  else if (type == "DEBUG") logTypeEmoji = "🐞";

  time = new Date();
  time_options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Yekaterinburg",
  };
  var dateTime = time.toLocaleString("ru-RU", time_options);

  extVersion = browser.runtime.getManifest().version;
  var message_to_send = `<b>${logTypeEmoji} ${type}</b>
%0A
<b>Функционал</b>: ${extClass} - ${extFunction}
%0A
<b>Лог</b>: ${message}
%0A%0A
<b>Версия расширения</b>: v${extVersion}
%0A
<i>Время лога: ${dateTime}</i>`;
  if (agreement != "") {
    message_to_send += `%0A<i>Договор</i>: <code>${agreement}</code>`;
  }
  fetch(
    `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${LOG_CHANNEL_ID}&text=${message_to_send}&parse_mode=HTML`,
    {
      method: "GET",
    }
  ).catch((error) => {
    console.log(error);
  });
}
