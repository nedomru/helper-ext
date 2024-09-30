if (
    document.URL.indexOf("ertelecom.ru/cgi-bin/ppo/excells") !== -1) {
    const config = {
        OTHER_DarkTheme_ARM: darkThemeARM,
        ARM_allowCopy: allowCopy
    };

    browser.storage.sync.get(Object.keys(config)).then((result) => {
        Object.keys(config).forEach((key) => {
            if (result[key]) {
                config[key]();
            }
        });
    });
}

async function darkThemeARM() {
    const style = document.createElement('style');
    style.innerHTML = `
    body {
        background-color: #1c1c1c !important;
        color: white !important; 
    }
    a,
b,
u,
td, div {
  color: #ffffff !important;
}

.alert .alert-warning .alert-info {
  color: #ffffff !important;
}

.alert-warning {
background-color: #464437 !important;}

.alert-info {
background-color: #3c4448 !important;}

.table {
  width: 100%;
  background-color: #1e1e1e;
}

.table th {
  background-color: #444444;
}

.table th {
  background-color: #1a1a1a;
  color: #ffffff;
}

#appeal table {
  width: 100%;
  background-color: #1e1e1e;
}
    
#appeal table th,
#appeal table td {
  background-color: #303030;
  color: #ffffff;
}

#appeal table a {
      color: #1E90FF;
}

.js-net-login-resource table {
  width: 100%;
  background-color: #1e1e1e;
    }
    
.js-net-login-resource table th,
.js-net-login-resource table td {
  background-color: #303030;
  color: #ffffff;
    }

.js-net-login-resource table a {
      color: #1E90FF; /* Link color */
}

.js-net-login-module table {
  width: 100%;
  background-color: #1e1e1e;
    }
    
.js-net-login-module table th,
.js-net-login-module table td {
  background-color: #303030;
  color: #ffffff;
    }

.js-net-login-module table a {
      color: #1E90FF;
}

.table-hover > tbody > tr:hover {
  background-color: #3e3b3b !important;
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

.js-net-login-action input[type="button"] {
    background-color: #996e00;
    color: white;
}

.addenda_expand > tr,td {
background-color: #fffff !important;
}

textarea {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
  border: 1px solid #444444 !important;
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

a {
  color: #7695ff;
}
  `;
    document.head.appendChild(style);
}

async function allowCopy() {
    setTimeout(async () => {
        const waiter = document.getElementById("waiter");
        if (!waiter) return; // Проверка на наличие waiter

        const {parentNode: parent} = waiter;
        parent.style = "";
        if (await browser.storage.sync.get("OTHER_DarkTheme_ARM").OTHER_DarkTheme_ARM) await darkThemeARM()
        parent.onselectstart = "";

        const formform = document.getElementById("formform");
        if (!formform) return; // Проверка на наличие formform

        [waiter, formform].forEach((el) => {
            el.onmousedown = el.onselectstart = (event) => event.stopPropagation();
        });
    }, 2000);
}

