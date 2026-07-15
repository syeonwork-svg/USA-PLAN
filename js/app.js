// USA Travel Planner - Core App Controller
const App = {
  currentTab: "calendar-tab",

  init() {
    // 1. Initialize Storage with mock data
    StorageManager.init();

    // 2. Setup theme (Dark / Light Mode)
    this.initTheme();

    // 3. Initialize components
    if (window.CalendarComponent) CalendarComponent.init();
    if (window.ItineraryComponent) ItineraryComponent.init();
    if (window.ExpensesComponent) ExpensesComponent.init();
    if (window.MapComponent) MapComponent.init();
    if (window.TicketsComponent) TicketsComponent.init();
    if (window.PassportsComponent) PassportsComponent.init();
    if (window.ChecklistComponent) ChecklistComponent.init();

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

    // Tab Snapshot Backup & Restore bindings
    const tabSaveBtn = document.getElementById("tab-save-snapshot-btn");
    if (tabSaveBtn) {
      tabSaveBtn.addEventListener("click", () => {
        StorageManager.saveSnapshot();
      });
    }

    // File backup export / import bindings
    const fileExportBtn = document.getElementById("file-export-btn");
    const fileImportTrigger = document.getElementById("file-import-btn-trigger");
    const fileImportInput = document.getElementById("file-import-input");

    if (fileExportBtn) {
      fileExportBtn.addEventListener("click", () => {
        StorageManager.exportBackup();
      });
    }
    if (fileImportTrigger && fileImportInput) {
      fileImportTrigger.addEventListener("click", () => {
        fileImportInput.click();
      });
      fileImportInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          StorageManager.importBackup(file);
        }
      });
    }

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
    const targetSec = document.getElementById(tabId);
    if (targetSec) {
      targetSec.classList.add("active");
    }

    // Render snapshot list when opening backup tab
    if (tabId === "backup-tab") {
      this.renderSnapshotsList();
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
    const savedTheme = localStorage.getItem("theme");
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
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
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

  renderSnapshotsList() {
    const container = document.getElementById("tab-snapshot-list-container");
    if (!container) return;
    container.innerHTML = "";

    const snapshots = StorageManager.getSnapshots();
    if (snapshots.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-secondary); font-size: 13px;">
          <span style="font-size: 24px; display: block; margin-bottom: 6px;">📭</span>
          저장된 내부 백업이 없습니다.<br>
          <span style="font-size: 11px; color: var(--text-tertiary); margin-top: 4px; display: block;">
            상단의 '저장하기' 버튼이나 단축키 Ctrl+S를 눌러 현재 입력 상태를 백업해 두세요.
          </span>
        </div>
      `;
      return;
    }

    snapshots.forEach((snap, idx) => {
      const item = document.createElement("div");
      item.className = "snapshot-item";
      item.style.padding = "12px 16px";
      item.style.background = "var(--bg-secondary)";
      item.style.border = "1px solid var(--border-color)";
      item.style.borderRadius = "8px";
      item.style.display = "flex";
      item.style.justifyContent = "space-between";
      item.style.alignItems = "center";
      item.style.gap = "12px";

      item.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 4px; flex-grow: 1; min-width: 0; text-align: left;">
          <span style="font-size: 14px; font-weight: 700; color: var(--text-primary);">${snap.timestamp}</span>
          <span style="font-size: 11.5px; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${snap.summary}
          </span>
        </div>
        <div style="display: flex; gap: 6px; flex-shrink: 0;">
          <button class="btn btn-sm restore-btn" style="font-size: 11.5px; padding: 5px 10px; font-weight:600; background: var(--accent-color); color: white; border: none; border-radius: 6px; cursor: pointer;">복원</button>
          <button class="btn btn-sm delete-btn" style="font-size: 11.5px; padding: 5px 8px; font-weight:600; border: 1px solid var(--border-color); background: var(--bg-primary); border-radius: 6px; cursor: pointer; color: var(--text-secondary);">✕</button>
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

// Start the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
