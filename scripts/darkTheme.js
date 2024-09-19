async function applyStyles(styleContent) {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(styleContent));
  document.head.appendChild(style);
}

async function skvozRequests() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}
a,
b,
u,
td {
  color: #ffffff !important;
}
select {
  background-color: #363535 !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
  appearance: none;
  -moz-appearance: none;
}
select option {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}
select:focus {
  outline: none;
  border-color: #0060df !important;
}
textarea {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
input {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
#ui-datepicker-div {
  color: #ffffff !important;
  background-color: #1e1e1e !important;
}
.ui-state-default,
.ui-widget-content .ui-state-default {
  border: 1px solid #d3d3d3;
  background: none;
  background-color: #1e1e1e !important;
  font-weight: normal;
  color: #555555;
}
.ui-widget-content {
  background: #1e1e1e !important;
  border: 1px solid #444444 !important;
}
.ui-accordion .ui-accordion-header {
  background: #2a2a2a !important;
  border-bottom: 1px solid #444444 !important;
  color: #ffffff !important;
}
.ui-accordion .ui-accordion-content {
  background: #1e1e1e !important;
  color: #ffffff !important;
}
.btn, button {
  background-color: #3c3c3c !important;
  color: #ffffff !important;
}
.notifyjs-bootstrap-base {
  background-color: #333 !important;
  color: #ffffff !important;
}
.notifyjs-bootstrap-error {
  background-color: #7c4d4d !important;
  color: #ffffff !important;
}
.notifyjs-bootstrap-success {
  background-color: #4caf50 !important;
  color: #ffffff !important;
}
    `;
  await applyStyles(darkThemeCSS);
}

async function clientFind() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}
a,
b,
u,
td {
  color: #ffffff !important;
}
select {
  background-color: #363535 !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
  appearance: none;
  -moz-appearance: none;
}
select option {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}
select:focus {
  outline: none;
  border-color: #0060df !important;
}
textarea {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
input {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
.ui-state-default,
.ui-widget-content .ui-state-default {
  border: 1px solid #d3d3d3;
  background: none;
  background-color: #1e1e1e !important;
  font-weight: normal;
  color: #555555;
}
.ui-widget-content {
  background: #1e1e1e !important;
  border: 1px solid #444444 !important;
}
.ui-accordion .ui-accordion-header {
  background: #2a2a2a !important;
  border-bottom: 1px solid #444444 !important;
  color: #ffffff !important;
}
.ui-accordion .ui-accordion-content {
  background: #1e1e1e !important;
  color: #ffffff !important;
}
.btn, button {
  background-color: #3c3c3c !important;
  color: #ffffff !important;
}
    `;
  await applyStyles(darkThemeCSS);
}

async function topFrame() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}
#btnViewKnowlegeBase {
  background-color: #03545e !important;
}
#actual_number {
  background-color: #4a2021 !important;
}
#btnViewScripting {
  background-color: #665106 !important;
}
#number_cc_field {
  background-color: #1c1c1c !important;
}
a, b {
  color: #ffffff !important;
}
.ui-accordion-header > form:nth-child(3) > div:nth-child(4) {
  background-color: #1c1c1c !important;
}
    `;
  await applyStyles(darkThemeCSS);
}

async function findSession() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}
a, b {
  color: #ffffff !important;
}
span.mac {
  color: #0099ff
}
    `;
  await applyStyles(darkThemeCSS);
}

async function applyTheme() {
  if (
    document.URL.includes(
      "ertelecom.ru/cgi-bin/ppo/excells/wcc2_main.frame_left_reasons"
    )
  ) {
    await skvozRequests();
  }

  if (
    document.URL.includes(
      "ertelecom.ru/cgi-bin/ppo/excells/wcc2_main.frame_left"
    )
  ) {
    await clientFind();
  }

  if (
    document.URL.includes(
      "ertelecom.ru/cgi-bin/ppo/excells/wcc2_main.frame_top"
    )
  ) {
    await topFrame();
  }

  if (
    document.URL.includes(
      "ertelecom.ru/cgi-bin/ppo/excells/radius_accounting_info.login_detail"
    )
  ) {
    await findSession();
  }
}

applyTheme();
