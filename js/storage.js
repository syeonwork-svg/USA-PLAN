// Storage utility for USA Travel Planner

const STORAGE_KEYS = {
  VERSION: "usa_travel_data_version",
  TRIP_DETAILS: "usa_travel_trip_details",
  EVENTS: "usa_travel_events",
  TIMELINE: "usa_travel_timeline",
  EXPENSES: "usa_travel_expenses",
  TICKETS: "usa_travel_tickets",
  PASSPORTS: "usa_travel_passports",
  CHECKLIST: "usa_travel_checklist",
  GOOGLE_PLACES: "usa_travel_google_places",
  MAP_CONFIG: "usa_travel_map_config"
};

const StorageManager = {
  // Initialize storage with mock data if empty
  init() {
    const CURRENT_VERSION = "v22";
    const savedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);

    // Non-destructive initialization: only set default if key doesn't exist
    if (!localStorage.getItem(STORAGE_KEYS.TRIP_DETAILS)) {
      localStorage.setItem(STORAGE_KEYS.TRIP_DETAILS, JSON.stringify(DEFAULT_TRIP_DETAILS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TIMELINE)) {
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(DEFAULT_TIMELINE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(DEFAULT_TICKETS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PASSPORTS)) {
      localStorage.setItem(STORAGE_KEYS.PASSPORTS, JSON.stringify(DEFAULT_PASSPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHECKLIST)) {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(DEFAULT_CHECKLIST));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GOOGLE_PLACES)) {
      localStorage.setItem(STORAGE_KEYS.GOOGLE_PLACES, JSON.stringify(GOOGLE_MAPS_PLACES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAP_CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.MAP_CONFIG, JSON.stringify({ googleMapsApiKey: "" }));
    }

    // Smart Migration for v17: Inject depCode / arrCode to old flight presets if missing
    try {
      let tickets = JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS));
      if (tickets && Array.isArray(tickets)) {
        let migrated = false;
        tickets = tickets.map(t => {
          if (t.category === "flight") {
            if (!t.depCode && t.title.includes("인천 ➔ 애틀랜타")) { t.depCode = "ICN"; t.arrCode = "ATL"; t.flightNo = "KE085"; migrated = true; }
            if (!t.depCode && t.title.includes("뉴욕 ➔ 인천")) { t.depCode = "JFK"; t.arrCode = "ICN"; t.flightNo = "KE082"; migrated = true; }
          }
          return t;
        });
        if (migrated) {
          localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
        }
      }
    } catch (e) {
      console.error("Migration error:", e);
    }

    // Update version string without clearing anything
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
  },

  getTripDetails() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIP_DETAILS)) || DEFAULT_TRIP_DETAILS;
  },

  saveTripDetails(details) {
    localStorage.setItem(STORAGE_KEYS.TRIP_DETAILS, JSON.stringify(details));
  },

  getEvents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS)) || DEFAULT_EVENTS;
  },

  saveEvents(events) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getTimeline() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TIMELINE)) || DEFAULT_TIMELINE;
  },

  saveTimeline(timeline) {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(timeline));
  },

  getExpenses() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES)) || DEFAULT_EXPENSES;
  },

  saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getTickets() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS)) || DEFAULT_TICKETS;
  },

  saveTickets(tickets) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  },

  getPassports() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSPORTS)) || DEFAULT_PASSPORTS;
  },

  savePassports(passports) {
    localStorage.setItem(STORAGE_KEYS.PASSPORTS, JSON.stringify(passports));
  },

  getChecklist() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKLIST)) || DEFAULT_CHECKLIST;
  },

  saveChecklist(checklist) {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
  },

  getGooglePlaces() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GOOGLE_PLACES)) || GOOGLE_MAPS_PLACES;
  },

  saveGooglePlaces(places) {
    localStorage.setItem(STORAGE_KEYS.GOOGLE_PLACES, JSON.stringify(places));
  },

  getMapConfig() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MAP_CONFIG)) || { googleMapsApiKey: "" };
  },

  saveMapConfig(config) {
    localStorage.setItem(STORAGE_KEYS.MAP_CONFIG, JSON.stringify(config));
  },

  // Reset to default
  resetAll() {
    localStorage.setItem(STORAGE_KEYS.TRIP_DETAILS, JSON.stringify(DEFAULT_TRIP_DETAILS));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(DEFAULT_TIMELINE));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(DEFAULT_TICKETS));
    localStorage.setItem(STORAGE_KEYS.PASSPORTS, JSON.stringify(DEFAULT_PASSPORTS));
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(DEFAULT_CHECKLIST));
    localStorage.setItem(STORAGE_KEYS.GOOGLE_PLACES, JSON.stringify(GOOGLE_MAPS_PLACES));
    localStorage.setItem(STORAGE_KEYS.MAP_CONFIG, JSON.stringify({ googleMapsApiKey: "" }));
    window.location.reload();
  },

  exportBackup() {
    const keys = [
      "usa_travel_trip_details",
      "usa_travel_events",
      "usa_travel_timeline",
      "usa_travel_expenses",
      "usa_travel_tickets",
      "usa_travel_passports",
      "usa_travel_checklist",
      "usa_travel_google_places",
      "usa_travel_map_config"
    ];
    const backupData = {};
    keys.forEach(key => {
      backupData[key] = localStorage.getItem(key);
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);

    const today = new Date().toISOString().split("T")[0];
    downloadAnchor.setAttribute("download", `usa_travel_planner_backup_${today}.json`);

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    App.showNotification("백업 파일이 다운로드되었습니다!");
  },

  importBackup(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backupData = JSON.parse(event.target.result);
        const keys = [
          "usa_travel_trip_details",
          "usa_travel_events",
          "usa_travel_timeline",
          "usa_travel_expenses",
          "usa_travel_tickets",
          "usa_travel_passports",
          "usa_travel_checklist",
          "usa_travel_google_places",
          "usa_travel_map_config"
        ];

        const hasKeys = keys.some(key => key in backupData);
        if (!hasKeys) {
          alert("올바른 백업 파일이 아닙니다. 파일 형식을 확인해주세요.");
          return;
        }

        keys.forEach(key => {
          if (backupData[key] !== undefined && backupData[key] !== null) {
            localStorage.setItem(key, backupData[key]);
          }
        });

        // Sync local storage versions to prevent mismatches
        localStorage.setItem("usa_travel_data_version", "v22");
        localStorage.setItem(this.VERSION || "usa_travel_version", "v22");

        alert("성공적으로 데이터가 복원되었습니다! 페이지를 새로고침하여 적용합니다.");
        window.location.reload();
      } catch (err) {
        alert("백업 파일 복원 오류: " + err.message);
      }
    };
    reader.readAsText(file);
  }
};
