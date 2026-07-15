// USA Travel Planner - Core App Controller
const App = {
  currentTab: "calendar-tab",

  init() {
    // 0. Intercept and load shared URL plans
    if (window.location.hash && window.location.hash.startsWith("#share=")) {
      try {
        const base64Data = window.location.hash.substring(7);
        const decodedJson = decodeURIComponent(escape(atob(base64Data)));
        const sharedObj = JSON.parse(decodedJson);
        
        if (sharedObj && typeof sharedObj === "object") {
          if (confirm("공유받은 여행 일정이 감지되었습니다! 이 일정을 불러와 브라우저에 적용하시겠습니까?\n(주의: 기존 브라우저에 등록해 둔 여행 정보가 공유된 일정으로 교체됩니다.)")) {
            const save = (key, val) => {
              if (val !== undefined && val !== null) {
                localStorage.setItem(key, typeof val === "string" ? val : JSON.stringify(val));
              }
            };
            
            save("usa_travel_details", sharedObj.tripDetails);
            save("usa_travel_events", sharedObj.events);
            save("usa_travel_timeline", sharedObj.timeline);
            save("usa_travel_expenses", sharedObj.expenses);
            save("usa_travel_tickets", sharedObj.tickets);
            save("usa_travel_candidates", sharedObj.candidates);
            save("usa_travel_checklist", sharedObj.checklist);
            save("usa_travel_passports", sharedObj.passports);
            save("usa_travel_version", "v40");
            save("usa_travel_data_version", "v40");

            window.location.hash = "";
            window.location.reload();
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load shared trip data:", e);
      }
      window.location.hash = "";
    }

    // 1. Initialize Storage with mock data
    StorageManager.init();

    // 2. Setup theme (Dark / Light Mode)
    this.initTheme();

    // 3. Initialize components
    try { if (window.CalendarComponent) CalendarComponent.init(); } catch (e) { console.error("Calendar init error:", e); }
    try { if (window.ItineraryComponent) ItineraryComponent.init(); } catch (e) { console.error("Itinerary init error:", e); }
    try { if (window.ExpensesComponent) ExpensesComponent.init(); } catch (e) { console.error("Expenses init error:", e); }
    try { if (window.MapComponent) MapComponent.init(); } catch (e) { console.error("Map init error:", e); }
    try { if (window.TicketsComponent) TicketsComponent.init(); } catch (e) { console.error("Tickets init error:", e); }
    try { if (window.PassportsComponent) PassportsComponent.init(); } catch (e) { console.error("Passports init error:", e); }
    try { if (window.ChecklistComponent) ChecklistComponent.init(); } catch (e) { console.error("Checklist init error:", e); }
    try { if (window.CandidatesComponent) CandidatesComponent.init(); } catch (e) { console.error("Candidates init error:", e); }

    // 4. Bind overall event listeners
    this.bindEvents();

    // 5. Load settings into form
    this.loadSettings();
  },

  bindEvents() {
    // Sidebar navigation tabs
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const tabId = item.dataset.tab;
        this.switchTab(tabId);
      });
    });

    // Theme checkbox
    const themeCheckbox = document.getElementById("theme-checkbox");
    themeCheckbox.addEventListener("change", (e) => {
      this.toggleTheme(e.target.checked);
    });

    // PDF Print Button
    const printBtn = document.getElementById("sidebar-print-btn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }

    // Sidebar Share Button
    const shareBtn = document.getElementById("sidebar-share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        try {
          const shareData = {
            tripDetails: StorageManager.getTripDetails(),
            events: StorageManager.getEvents(),
            timeline: StorageManager.getTimeline(),
            expenses: StorageManager.getExpenses(),
            tickets: StorageManager.getTickets(),
            candidates: StorageManager.getCandidates(),
            checklist: StorageManager.getChecklist(),
            passports: StorageManager.getPassports()
          };
          const jsonString = JSON.stringify(shareData);
          const base64Str = btoa(unescape(encodeURIComponent(jsonString)));
          const shareUrl = window.location.origin + window.location.pathname + "#share=" + base64Str;
          
          navigator.clipboard.writeText(shareUrl).then(() => {
            this.showNotification("공유 링크가 클립보드에 복사되었습니다! 필요한 사람에게 보내주세요. 🔗");
          }).catch(err => {
            // Fallback for browsers with restricted clipboard permission
            const textarea = document.createElement("textarea");
            textarea.value = shareUrl;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            try {
              document.execCommand("copy");
              this.showNotification("공유 링크가 클립보드에 복사되었습니다! 🔗");
            } catch (e) {
              alert("링크 생성 성공! 아래 주소를 복사해 주세요:\n\n" + shareUrl);
            }
            document.body.removeChild(textarea);
          });
        } catch (e) {
          console.error("Failed to generate share URL:", e);
          alert("공유 링크 생성 중 오류가 발생했습니다.");
        }
      });
    }

    // Settings save
    document.getElementById("save-settings-btn").addEventListener("click", () => {
      this.saveSettings();
    });

    // Reset data
    document.getElementById("reset-data-btn").addEventListener("click", () => {
      if (confirm("정말 모든 데이터를 초기화하고 처음 상태(이미지 일정)로 되돌리시겠습니까?")) {
        StorageManager.resetAll();
      }
    });

    // Sidebar Snapshot Backup & Restore
    const sbSaveBtn = document.getElementById("sb-save-snapshot-btn");
    const sbRestoreTrigger = document.getElementById("sb-restore-snapshot-btn");

    if (sbSaveBtn) {
      sbSaveBtn.addEventListener("click", () => {
        StorageManager.saveSnapshot();
      });
    }
    if (sbRestoreTrigger) {
      sbRestoreTrigger.addEventListener("click", () => {
        this.openSnapshotModal();
      });
    }

    // Modal Close Bindings
    const closeBtn = document.getElementById("close-snapshot-modal-btn");
    const closeFooterBtn = document.getElementById("close-snapshot-modal-footer-btn");
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeSnapshotModal());
    if (closeFooterBtn) closeFooterBtn.addEventListener("click", () => this.closeSnapshotModal());

    // Intercept Ctrl+S / Cmd+S globally
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        StorageManager.saveSnapshot();
      }
    });
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // 1. Update sidebar active class
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.remove("active");
      if (item.dataset.tab === tabId) {
        item.classList.add("active");
      }
    });

    // 2. Show correct section
    document.querySelectorAll(".content-section").forEach(sec => {
      sec.classList.remove("active");
    });
    document.getElementById(tabId).classList.add("active");

    // Re-render components on tab switch to guarantee fresh database load
    try {
      if (tabId === "tickets-tab" && window.TicketsComponent) TicketsComponent.render();
      if (tabId === "calendar-tab" && window.CalendarComponent) CalendarComponent.render();
      if (tabId === "itinerary-tab" && window.ItineraryComponent) ItineraryComponent.render();
      if (tabId === "expenses-tab" && window.ExpensesComponent) ExpensesComponent.render();
      if (tabId === "candidates-tab" && window.CandidatesComponent) CandidatesComponent.render();
      if (tabId === "passports-tab" && window.PassportsComponent) PassportsComponent.render();
      if (tabId === "checklist-tab" && window.ChecklistComponent) ChecklistComponent.render();
    } catch (e) {
      console.warn("Component tab refresh failed:", e);
    }

    // 3. Leaflet/Google Map resize fix (Crucial for maps loaded in hidden containers)
    if (tabId === "map-tab" && window.MapComponent) {
      setTimeout(() => {
        if (MapComponent.leafletMap) {
          MapComponent.leafletMap.invalidateSize();
        }
        if (MapComponent.googleMap) {
          google.maps.event.trigger(MapComponent.googleMap, "resize");
        }
        // Focus on currently selected date pins
        if (window.ItineraryComponent) {
          MapComponent.focusOnDay(ItineraryComponent.selectedDate);
        }
      }, 100);
    }
  },

  initTheme() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem("theme");
    } catch (e) {
      console.warn("Theme loading failed from localStorage:", e);
    }
    const themeCheckbox = document.getElementById("theme-checkbox");
    
    let isDark = false;
    
    if (savedTheme) {
      isDark = savedTheme === "dark";
    } else {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    themeCheckbox.checked = isDark;
    this.toggleTheme(isDark);
  },

  toggleTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {
        console.warn("Theme writing failed to localStorage:", e);
      }
    } else {
      document.documentElement.removeAttribute("data-theme");
      try {
        localStorage.setItem("theme", "light");
      } catch (e) {
        console.warn("Theme writing failed to localStorage:", e);
      }
    }

    // Refresh map if initialized to apply light/dark tile skins
    if (window.MapComponent) {
      if (MapComponent.leafletMap) {
        MapComponent.initLeaflet(); // Re-initialize leaflet to apply new theme tile layer
      } else if (MapComponent.googleMap) {
        MapComponent.initGoogleMap(); // Re-style Google Maps
      }
    }
  },

  loadSettings() {
    const config = StorageManager.getMapConfig();
    document.getElementById("google-api-key").value = config.googleMapsApiKey || "";
  },

  saveSettings() {
    const apiKey = document.getElementById("google-api-key").value.trim();
    StorageManager.saveMapConfig({ googleMapsApiKey: apiKey });
    
    this.showNotification("설정이 성공적으로 저장되었습니다. 지도를 업데이트합니다.");

    if (window.MapComponent) {
      MapComponent.updateMapMode();
    }
  },

  showNotification(message) {
    const toast = document.getElementById("app-notification");
    const text = document.getElementById("notification-text");
    
    if (text && toast) {
      text.innerText = message;
      toast.classList.add("show");
      
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    }
  },

  openSnapshotModal() {
    const modal = document.getElementById("snapshot-modal");
    if (modal) {
      this.renderSnapshotsList();
      modal.classList.add("active");
    }
  },

  closeSnapshotModal() {
    const modal = document.getElementById("snapshot-modal");
    if (modal) {
      modal.classList.remove("active");
    }
  },

  renderSnapshotsList() {
    const container = document.getElementById("snapshot-list-container");
    if (!container) return;
    container.innerHTML = "";

    const snapshots = StorageManager.getSnapshots();
    if (snapshots.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-secondary); font-size: 13px;">
          <span style="font-size: 24px; display: block; margin-bottom: 6px;">📭</span>
          저장된 내부 백업이 없습니다.<br>
          <span style="font-size: 11px; color: var(--text-tertiary); margin-top: 4px; display: block;">
            사이드바의 '저장' 버튼이나 단축키 Ctrl+S를 눌러 현재 입력 상태를 백업해 두세요.
          </span>
        </div>
      `;
      return;
    }

    snapshots.forEach((snap, idx) => {
      const item = document.createElement("div");
      item.style.padding = "10px 12px";
      item.style.background = "var(--bg-secondary)";
      item.style.border = "1px solid var(--border-color)";
      item.style.borderRadius = "8px";
      item.style.display = "flex";
      item.style.justifyContent = "space-between";
      item.style.alignItems = "center";
      item.style.gap = "8px";

      item.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 3px; flex-grow: 1; min-width: 0; text-align: left;">
          <span style="font-size: 13px; font-weight: 700; color: var(--text-primary);">${snap.timestamp}</span>
          <span style="font-size: 11px; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${snap.summary}
          </span>
        </div>
        <div style="display: flex; gap: 4px; flex-shrink: 0;">
          <button class="btn btn-sm restore-btn" style="font-size: 11px; padding: 4px 8px; font-weight:600; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">복원</button>
          <button class="btn btn-sm delete-btn" style="font-size: 11px; padding: 4px 6px; font-weight:600; border: 1px solid var(--border-color); background: var(--bg-primary); border-radius: 4px; cursor: pointer; color: var(--text-secondary);">✕</button>
        </div>
      `;

      item.querySelector(".restore-btn").addEventListener("click", () => {
        if (confirm(`${snap.timestamp} 시점으로 데이터를 복원하시겠습니까? 현재 화면의 모든 최신 데이터가 이 시점 저장분으로 대체됩니다.`)) {
          StorageManager.restoreSnapshot(idx);
        }
      });

      item.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("이 저장본을 삭제하시겠습니까?")) {
          StorageManager.deleteSnapshot(idx);
          this.renderSnapshotsList();
        }
      });

      container.appendChild(item);
    });
  }
};

window.App = App;

// Start the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
