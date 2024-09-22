async function applyStyles(styleContent) {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(styleContent));
  document.head.appendChild(style);
}

// Левый фрейм
async function leftFrame() {
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

// Окно поиска клиента
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

//Хедер АРМа
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

// Найти сессию
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

// Проверка доступа
async function checkAccess() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}
a, b {
  color: #ffffff !important;
}
input {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
select {
  background-color: #363535 !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
select option {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}
select:focus {
  outline: none;
  border-color: #0060df !important;
}
    `;
  await applyStyles(darkThemeCSS);
}

// Сессии за период
async function sessionsByTime() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}
a, b {
  color: #ffffff !important;
}
input {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
.dropdown-menu {
  background-color: #1e1e1e !important;
}
.datepicker table tr td.day:hover, .datepicker table tr td.day.focused {
background: #444444 !important;
}
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1e1e1e;
}

.table th,
.table td {
  border: 1px solid #1e1e1e;
  background-color: #444444;
  padding: 8px;
  text-align: center;
}

.table th {
  background-color: #1a1a1a;
  color: #ffffff;
}

.text-primary {
  color: #3bd2f2; /* Цвет ссылок */
}

.breadcrumb {
  background-color: #1a1a1a;
}

select {
  background-color: #363535 !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
select option {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}
select:focus {
  outline: none;
  border-color: #0060df !important;
}

.btn, button {
  background-color: #3c3c3c !important;
}
    `;
  await applyStyles(darkThemeCSS);
}

// Акции на удержание
async function compensations() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}
a, b {
  color: #ffffff !important;
}
input {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
.dropdown-menu {
  background-color: #1e1e1e !important;
}
.datepicker table tr td.day:hover, .datepicker table tr td.day.focused {
background: #444444 !important;
}
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1e1e1e;
}

.compensation {
  color: #1e1e1e;
}

.table th, td {
  background-color: #1a1a1a;
  color: #ffffff;
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
    `;
  await applyStyles(darkThemeCSS);
}

// Смена ТП
async function changeTariff() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}
input {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1e1e1e;
}

.table th, td {
  background-color: #1a1a1a;
  color: #ffffff;
}

.table > :not(caption) > * > * {
  background-color: #1a1a1a;
}

.row {
  background-color: #1a1a1a;
}
.select2-results__option--selectable {
  background-color: #1a1a1a;
}
.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default, .ui-button, html .ui-button.ui-state-disabled:hover, html .ui-button.ui-state-disabled:active {
  background: #0060df;
}
.ui-slider-horizontal .ui-slider-range {
  background-color: #444444;
}
.select2-container--default .select2-selection--multiple .select2-selection__choice {
background-color: #444444;
}
.table-light {
--bs-table-hover-bg: #444444;
}
.modal-content {
  background-color: #1a1a1a;
  color: #ffffff;
}
.card {
  background-color: #1a1a1a;
  color: #ffffff;
}
    `;
  await applyStyles(darkThemeCSS);
}

async function widgetPage() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}

select {
  background-color: #363535 !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
select option {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}
select:focus {
  outline: none;
  border-color: #0060df !important;
}

input {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
}
.header-dom-ru {
background-color: #996e00;
}
    `;
  await applyStyles(darkThemeCSS);
}

// Скриптинг
// async function scripting() {
//   const darkThemeCSS = `
// .layout-row {
//   background-color: #1c1c1c !important;
//   color: #ffffff !important;
// }

// md-tabs.md-default-theme .md-tab, md-tabs .md-tab {
//   color: #ffffff !important;
// }

// md-bottom-sheet.md-default-theme, md-bottom-sheet {
// background-color: #444444;
// }

// .breadcrumb {
// background-color: #353535;
// }

// .script > div:nth-child(1) > div:nth-child(1) > ccs-scenario-select-button:nth-child(1) > div:nth-child(1) > span:nth-child(2) {
// color: #ffffff !important;
// }

// textarea {
// color: #ffffff !important;
// }

// md-option {
// color: #ffffff !important;
// background-color: #444444; }

// .md-select-menu-container.md-active md-select-menu > * {
// background-color: #444444;
// }

// md-menu-content {
// background-color: #444444;
// }
// .md-select-value > span:not(.md-select-icon) .md-text {
// color: #ffffff !important;
// }

// md-dialog md-dialog-content {
// background-color: #444444;
// }

// md-dialog md-dialog-content:not([layout="row"]) > :first-child:not(.md-subheader) {
// color: #ffffff !important;
// }

// md-dialog .md-actions, md-dialog md-dialog-actions {
// background-color: #353535;
// }

// md-select.md-default-theme .md-select-value, md-select .md-select-value {
// background-color: #353535;
// }

// .black-text, .black-text li, .black-text p {
// color: #ffffff !important;
// }

// .layout-fill {
// background-color: #444444;
//   color: #ffffff !important;
// }

// p {
//   color: #ffffff !important;
// }

// .md-subheader.md-default-theme, .md-subheader {
// background-color: #444444;
//   color: #ffffff !important;
// }

// .md-api-table tr:nth-child(2n+1) td, .odd {
// background-color: #444444;
// }

// .md-button.md-default-theme.md-primary.md-fab, .md-button.md-primary.md-fab, .md-button.md-default-theme.md-primary.md-raised, .md-button.md-primary.md-raised {
// background-color: #996e00;
// color: #f2d593;
// }

// button.md-raised:nth-child(2) {
//   background-color: #444444;
//   color: #ffffff !important;
// }

// md-content.layout-column {
//   background-color: #1c1c1c !important;
//   color: #ffffff !important;
// }

// md-toolbar.md-table-toolbar.md-default-theme:not(.md-menu-toolbar).md-default, md-toolbar.md-table-toolbar:not(.md-menu-toolbar).md-default {
//   background-color: #444444;
//   color: #ffffff !important;
//   }

// #input-9 {
//   background-color: #1e1e1e !important;
//   color: #ffffff !important;
// }

// .md-datepicker-input {
//   background-color: #1e1e1e;
//   color: #ffffff !important;
// }

// md-input-container.md-block:nth-child(1) > label:nth-child(1) {

//   color: #ffffff !important;
//   }

// .md-calendar-month-label.md-calendar-label-clickable {
//   background-color: #444444;
//   color: #ffffff !important;
// }

// .md-default-theme .md-datepicker-calendar, .md-datepicker-calendar {
//   background-color: #444444;
// }

//     `;
//   await applyStyles(darkThemeCSS);
// }

// Страница входа
async function loginPage() {
  const darkThemeCSS = `
body {
  background-color: #1c1c1c !important;
  color: #ffffff !important;
}

.ui-state-default,
.ui-widget-content .ui-state-default {
  background: none;
  background-color: #1e1e1e !important;
  font-weight: normal;
  color: #555555;
}
.ui-widget-content {
  background: #1e1e1e !important;
}
.ui-accordion .ui-accordion-header {
  background: #2a2a2a !important;
  color: #ffffff !important;
}
.ui-accordion .ui-accordion-content {
  background: #1e1e1e !important;
  color: #ffffff !important;
}

.validateTips {
  color: #ffffff !important;
 }

td {
  color: #ffffff !important;
}

.ui-button-text-only .ui-button-text {
  color: #ffffff !important;
}

#add_user_phnum > form:nth-child(1) {
  color: #ffffff !important;
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
    await leftFrame();
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

  if (
    document.URL.includes(
      "ertelecom.ru/static_pages/private/wcc/client_session"
    )
  ) {
    await sessionsByTime();
  }

  if (
    document.URL.includes("ertelecom.ru/cgi-bin/ppo/excells/adv_act_retention")
  ) {
    await compensations();
  }

  if (
    document.URL.includes("ertelecom.ru/static_pages/private/wcc/change_tariff")
  ) {
    await changeTariff();
  }

  // if (document.URL.includes("scripting-app")) {
  //   await scripting();
  // }

  if (
    document.URL.includes("ertelecom.ru/cgi-bin/ppo/excells/wcc_main.login") ||
    document.URL.includes(
      "ertelecom.ru/cgi-bin/ppo/excells/wcc_main.entry_continue"
    )
  ) {
    await loginPage();
  }

  if (
    document.URL.includes(
      "ertelecom.ru/static_pages/private/wcc/intercom_connection"
    )
  ) {
    await widgetPage();
  }

  if (
    document.URL.includes(
      "ertelecom.ru/cgi-bin/ppo/excells/access_show.show_access"
    ) ||
    document.URL.includes(
      "ertelecom.ru/cgi-bin/ppo/excells/access_show.show_fr_trace"
    )
  ) {
    await checkAccess();
  }
}

applyTheme();
