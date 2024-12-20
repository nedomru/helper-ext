if (document.URL.indexOf("genesys-ntp") !== -1) {
  const LINE_config = {
    LINE_showFB: specialistButtons,
    LINE_highlightOperators: highlightOperators,
    LINE_dutyButtons: dutyButtons,
    // LINE_updateNeededSL: updateNeededSL,
    LINE_countAppointments: countAppointments,
    LINE_highlightEndingAppointments: highlightEndingAppointments
  };

  browser.storage.sync.get(Object.keys(LINE_config)).then((result) => {
    Object.keys(LINE_config).forEach((key) => {
      if (result[key]) {
        LINE_config[key]();
      }
    });
  });
}
