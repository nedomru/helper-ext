function skvozRequests() {
  const style = document.createElement("style");

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
  background-color: #363535 !important; /* Dark background */
  color: #ffffff !important; /* White text */
  border: 1px solid #444444 !important; /* Dark border */
  appearance: none; /* Remove default styles */
  -moz-appearance: none; /* For Firefox */
}
select option {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}
select:focus {
  outline: none; /* Remove outline */
  border-color: #0060df !important;
}
textarea {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important; /* Dark border */
  appearance: none; /* Remove default styles */
}
input {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important; /* Dark border */
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
  color: #ffffff !important; /* Header text */
}
.ui-accordion .ui-accordion-content {
  background: #1e1e1e !important;
  color: #ffffff !important; /* Accordion content text */
}
.btn, button {
  background-color: #3c3c3c !important;
  color: #ffffff !important; /* Button text */
}
.notifyjs-bootstrap-base {
  background-color: #333 !important; /* Notify background */
  color: #ffffff !important; /* Notify text */
}
.notifyjs-bootstrap-error {
  background-color: #7c4d4d !important; /* Error notify */
  color: #ffffff !important;
}
.notifyjs-bootstrap-success {
  background-color: #4caf50 !important; /* Success notify */
  color: #ffffff !important;
}
    `;

  // Append the CSS to the style element
  style.appendChild(document.createTextNode(darkThemeCSS));

  // Append the style element to the head of the document
  document.head.appendChild(style);
}

function clientFind() {
  const style = document.createElement("style");

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
  background-color: #363535 !important; /* Dark background */
  color: #ffffff !important; /* White text */
  border: 1px solid #444444 !important; /* Dark border */
  appearance: none; /* Remove default styles */
  -moz-appearance: none; /* For Firefox */
}
select option {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}
select:focus {
  outline: none; /* Remove outline */
  border-color: #0060df !important;
}
textarea {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important; /* Dark border */
  appearance: none; /* Remove default styles */
}
input {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important; /* Dark border */
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
  color: #ffffff !important; /* Header text */
}
.ui-accordion .ui-accordion-content {
  background: #1e1e1e !important;
  color: #ffffff !important; /* Accordion content text */
}
.btn, button {
  background-color: #3c3c3c !important;
  color: #ffffff !important; /* Button text */
}
    `;

  // Append the CSS to the style element
  style.appendChild(document.createTextNode(darkThemeCSS));

  // Append the style element to the head of the document
  document.head.appendChild(style);
}

function topFrame() {
  const style = document.createElement("style");

  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}
#btnViewKnowlegeBase {
background-color: #03545e !important
}

#actual_number {
background-color: #4a2021 !important
}

#btnViewScripting {
background-color: #665106 !important
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

  // Append the CSS to the style element
  style.appendChild(document.createTextNode(darkThemeCSS));

  // Append the style element to the head of the document
  document.head.appendChild(style);
}

if (
  document.URL.indexOf(
    "ertelecom.ru/cgi-bin/ppo/excells/wcc2_main.frame_left_reasons"
  ) != -1
) {
  skvozRequests();
}

if (
  document.URL.indexOf(
    "ertelecom.ru/cgi-bin/ppo/excells/wcc2_main.frame_left"
  ) != -1
) {
  clientFind();
}

if (
  document.URL.indexOf(
    "ertelecom.ru/cgi-bin/ppo/excells/wcc2_main.frame_top"
  ) != -1
) {
  topFrame();
}
