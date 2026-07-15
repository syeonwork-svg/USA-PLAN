// Storage utility for USA Travel Planner

const STORAGE_KEYS = {
  VERSION: "usa_travel_data_version",
  TRIP_DETAILS: "usa_travel_trip_details",
  EVENTS: "usa_travel_events",
  TIMELINE: "usa_travel_timeline",
  EXPENSES: "usa_travel_expenses",
  TICKETS: "usa_travel_tickets",
  MAP_CONFIG: "usa_travel_map_config"
};

const StorageManager = {
  // Initialize storage with mock data if empty
  init() {
    const CURRENT_VERSION = "v4";
    const savedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);

    if (savedVersion !== CURRENT_VERSION) {
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      localStorage.setItem(STORAGE_KEYS.TRIP_DETAILS, JSON.stringify(DEFAULT_TRIP_DETAILS));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(DEFAULT_TIMELINE));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(DEFAULT_TICKETS));
      if (!localStorage.getItem(STORAGE_KEYS.MAP_CONFIG)) {
        localStorage.setItem(STORAGE_KEYS.MAP_CONFIG, JSON.stringify({ googleMapsApiKey: "" }));
      }
      return;
    }

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
    if (!localStorage.getItem(STORAGE_KEYS.MAP_CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.MAP_CONFIG, JSON.stringify({ googleMapsApiKey: "" }));
    }
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
    localStorage.setItem(STORAGE_KEYS.MAP_CONFIG, JSON.stringify({ googleMapsApiKey: "" }));
    window.location.reload();
  }
};
