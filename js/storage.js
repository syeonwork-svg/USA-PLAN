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
  CANDIDATES: "usa_travel_candidates",
  GOOGLE_PLACES: "usa_travel_google_places",
  MAP_CONFIG: "usa_travel_map_config"
};

const StorageManager = {
  // Initialize storage with mock data if empty (non-destructive)
  init() {
    try {
      const CURRENT_VERSION = "v34";
      let savedVersion = null;
      try {
        savedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
      } catch (e) {
        console.warn("localStorage version read failed:", e);
      }

      // Check each storage table non-destructively
      if (!this.getItemRaw(STORAGE_KEYS.TRIP_DETAILS)) {
        this.saveTripDetails(DEFAULT_TRIP_DETAILS);
      }
      if (!this.getItemRaw(STORAGE_KEYS.EVENTS)) {
        this.saveEvents(DEFAULT_EVENTS);
      }
      if (!this.getItemRaw(STORAGE_KEYS.TIMELINE)) {
        this.saveTimeline(DEFAULT_TIMELINE);
      }
      if (!this.getItemRaw(STORAGE_KEYS.EXPENSES)) {
        this.saveExpenses(DEFAULT_EXPENSES);
      }
      if (!this.getItemRaw(STORAGE_KEYS.TICKETS)) {
        this.saveTickets(DEFAULT_TICKETS);
      }
      if (!this.getItemRaw(STORAGE_KEYS.PASSPORTS)) {
        this.savePassports(DEFAULT_PASSPORTS);
      }
      if (!this.getItemRaw(STORAGE_KEYS.CHECKLIST)) {
        this.saveChecklist(DEFAULT_CHECKLIST);
      }
      if (!this.getItemRaw(STORAGE_KEYS.CANDIDATES)) {
        this.saveCandidates(DEFAULT_CANDIDATES);
      }
      if (!this.getItemRaw(STORAGE_KEYS.GOOGLE_PLACES)) {
        this.saveGooglePlaces(GOOGLE_MAPS_PLACES);
      }
      if (!this.getItemRaw(STORAGE_KEYS.MAP_CONFIG)) {
        this.saveMapConfig({ googleMapsApiKey: "" });
      }

      // Always update saved version flag to allow software updates without formatting
      try {
        localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
        localStorage.setItem("usa_travel_data_version", CURRENT_VERSION);
      } catch (e) {}
    } catch (e) {
      console.error("StorageManager init failed:", e);
    }
  },

  // Raw helper to get item safely without throwing
  getItemRaw(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },

  getTripDetails() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.TRIP_DETAILS));
      return (data && typeof data === "object" && !Array.isArray(data)) ? data : DEFAULT_TRIP_DETAILS;
    } catch (e) {
      return DEFAULT_TRIP_DETAILS;
    }
  },

  saveTripDetails(details) {
    try {
      localStorage.setItem(STORAGE_KEYS.TRIP_DETAILS, JSON.stringify(details));
    } catch (e) {
      console.warn("Storage write failed for trip details:", e);
    }
  },

  getEvents() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.EVENTS));
      return Array.isArray(data) ? data : DEFAULT_EVENTS;
    } catch (e) {
      return DEFAULT_EVENTS;
    }
  },

  saveEvents(events) {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.warn("Storage write failed for events:", e);
    }
  },

  getTimeline() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.TIMELINE));
      return (data && typeof data === "object" && !Array.isArray(data)) ? data : DEFAULT_TIMELINE;
    } catch (e) {
      return DEFAULT_TIMELINE;
    }
  },

  saveTimeline(timeline) {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(timeline));
    } catch (e) {
      console.warn("Storage write failed for timeline:", e);
    }
  },

  getExpenses() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.EXPENSES));
      return Array.isArray(data) ? data : DEFAULT_EXPENSES;
    } catch (e) {
      return DEFAULT_EXPENSES;
    }
  },

  saveExpenses(expenses) {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.warn("Storage write failed for expenses:", e);
    }
  },

  getTickets() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.TICKETS));
      return Array.isArray(data) ? data : DEFAULT_TICKETS;
    } catch (e) {
      return DEFAULT_TICKETS;
    }
  },

  saveTickets(tickets) {
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch (e) {
      console.warn("Storage write failed for tickets:", e);
    }
  },

  getPassports() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.PASSPORTS));
      return Array.isArray(data) ? data : DEFAULT_PASSPORTS;
    } catch (e) {
      return DEFAULT_PASSPORTS;
    }
  },

  savePassports(passports) {
    try {
      localStorage.setItem(STORAGE_KEYS.PASSPORTS, JSON.stringify(passports));
    } catch (e) {
      console.warn("Storage write failed for passports:", e);
    }
  },

  getChecklist() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.CHECKLIST));
      return Array.isArray(data) ? data : DEFAULT_CHECKLIST;
    } catch (e) {
      return DEFAULT_CHECKLIST;
    }
  },

  saveChecklist(checklist) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
    } catch (e) {
      console.warn("Storage write failed for checklist:", e);
    }
  },

  getGooglePlaces() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.GOOGLE_PLACES));
      return Array.isArray(data) ? data : GOOGLE_MAPS_PLACES;
    } catch (e) {
      return GOOGLE_MAPS_PLACES;
    }
  },

  saveGooglePlaces(places) {
    try {
      localStorage.setItem(STORAGE_KEYS.GOOGLE_PLACES, JSON.stringify(places));
    } catch (e) {
      console.warn("Storage write failed for Google places:", e);
    }
  },

  getMapConfig() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.MAP_CONFIG));
      return (data && typeof data === "object" && !Array.isArray(data)) ? data : { googleMapsApiKey: "" };
    } catch (e) {
      return { googleMapsApiKey: "" };
    }
  },

  saveMapConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEYS.MAP_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn("Storage write failed for map config:", e);
    }
  },

  getCandidates() {
    try {
      const data = JSON.parse(this.getItemRaw(STORAGE_KEYS.CANDIDATES));
      return Array.isArray(data) ? data : DEFAULT_CANDIDATES;
    } catch (e) {
      return DEFAULT_CANDIDATES;
    }
  },

  saveCandidates(candidates) {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch (e) {
      console.warn("Storage write failed for candidates:", e);
    }
  },

  // Reset to default
  resetAll() {
    try {
      localStorage.setItem(STORAGE_KEYS.TRIP_DETAILS, JSON.stringify(DEFAULT_TRIP_DETAILS));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(DEFAULT_TIMELINE));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(DEFAULT_TICKETS));
      localStorage.setItem(STORAGE_KEYS.PASSPORTS, JSON.stringify(DEFAULT_PASSPORTS));
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(DEFAULT_CHECKLIST));
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(DEFAULT_CANDIDATES));
      localStorage.setItem(STORAGE_KEYS.GOOGLE_PLACES, JSON.stringify(GOOGLE_MAPS_PLACES));
      localStorage.setItem(STORAGE_KEYS.MAP_CONFIG, JSON.stringify({ googleMapsApiKey: "" }));
    } catch (e) {
      console.warn("Storage reset failed:", e);
    }
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
      "usa_travel_candidates",
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
          "usa_travel_candidates",
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
        localStorage.setItem("usa_travel_data_version", "v34");
        localStorage.setItem(this.VERSION || "usa_travel_version", "v34");

        alert("성공적으로 데이터가 복원되었습니다! 페이지를 새로고침하여 적용합니다.");
        window.location.reload();
      } catch (err) {
        alert("백업 파일 복원 오류: " + err.message);
      }
    };
    reader.readAsText(file);
  },

  getSnapshots() {
    try {
      return JSON.parse(localStorage.getItem("usa_travel_planner_snapshots")) || [];
    } catch (e) {
      return [];
    }
  },

  saveSnapshot() {
    const keys = [
      "usa_travel_trip_details",
      "usa_travel_events",
      "usa_travel_timeline",
      "usa_travel_expenses",
      "usa_travel_tickets",
      "usa_travel_passports",
      "usa_travel_checklist",
      "usa_travel_candidates",
      "usa_travel_google_places",
      "usa_travel_map_config"
    ];
    const snapshotData = {};
    keys.forEach(key => {
      snapshotData[key] = localStorage.getItem(key);
    });

    // Helper counts for display
    let timelineCount = 0;
    try {
      const tl = JSON.parse(snapshotData.usa_travel_timeline || "{}");
      Object.keys(tl).forEach(day => {
        timelineCount += (tl[day] || []).length;
      });
    } catch(e){}

    let ticketCount = 0;
    try { ticketCount = (JSON.parse(snapshotData.usa_travel_tickets || "[]")).length; } catch(e){}

    let expenseCount = 0;
    try { expenseCount = (JSON.parse(snapshotData.usa_travel_expenses || "[]")).length; } catch(e){}

    let checklistCount = 0;
    try { checklistCount = (JSON.parse(snapshotData.usa_travel_checklist || "[]")).length; } catch(e){}

    const now = new Date();
    // Beautiful date time in KST
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

    const newSnapshot = {
      timestamp,
      summary: `일정 ${timelineCount}개, 티켓 ${ticketCount}개, 경비 ${expenseCount}개, 체크리스트 ${checklistCount}개`,
      data: snapshotData
    };

    let snapshots = this.getSnapshots();
    snapshots.unshift(newSnapshot); // Put at front
    if (snapshots.length > 10) {
      snapshots = snapshots.slice(0, 10); // Keep max 10
    }

    localStorage.setItem("usa_travel_planner_snapshots", JSON.stringify(snapshots));
    
    if (window.App && typeof App.showNotification === "function") {
      App.showNotification("현재 상태가 성공적으로 저장되었습니다!");
    } else {
      alert("현재 상태가 임시 백업으로 저장되었습니다!");
    }
  },

  restoreSnapshot(index) {
    const snapshots = this.getSnapshots();
    const snap = snapshots[index];
    if (!snap || !snap.data) {
      alert("해당 스냅샷 데이터를 찾을 수 없습니다.");
      return;
    }

    const keys = [
      "usa_travel_trip_details",
      "usa_travel_events",
      "usa_travel_timeline",
      "usa_travel_expenses",
      "usa_travel_tickets",
      "usa_travel_passports",
      "usa_travel_checklist",
      "usa_travel_candidates",
      "usa_travel_google_places",
      "usa_travel_map_config"
    ];

    keys.forEach(key => {
      if (snap.data[key] !== undefined && snap.data[key] !== null) {
        localStorage.setItem(key, snap.data[key]);
      }
    });

    // Make sure versions stay matched
    localStorage.setItem("usa_travel_data_version", "v34");
    localStorage.setItem("usa_travel_version", "v34");

    alert(`${snap.timestamp} 시점의 백업으로 복원 완료되었습니다! 페이지를 새로고침합니다.`);
    window.location.reload();
  },

  deleteSnapshot(index) {
    let snapshots = this.getSnapshots();
    snapshots.splice(index, 1);
    localStorage.setItem("usa_travel_planner_snapshots", JSON.stringify(snapshots));
  }
};
window.StorageManager = StorageManager;
