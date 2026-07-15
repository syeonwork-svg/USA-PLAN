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
    
    text.innerText = message;
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
};

// Start the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
