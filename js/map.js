// USA Travel Planner - Map Component
const MapComponent = {
  leafletMap: null,
  googleMap: null,
  leafletMarkers: [],
  googleMarkers: [],
  routeLine: null,
  isGoogleLoaded: false,

  init() {
    this.updateMapMode();
  },

  updateMapMode() {
    const config = StorageManager.getMapConfig();
    const apiKey = config.googleMapsApiKey;

    const leafletEl = document.getElementById("leaflet-map");
    const googleEl = document.getElementById("google-map");

    if (apiKey && apiKey.trim() !== "") {
      // Load Google Map
      leafletEl.style.display = "none";
      googleEl.style.display = "block";
      this.loadGoogleMapsScript(apiKey);
    } else {
      // Load Leaflet Map
      leafletEl.style.display = "block";
      googleEl.style.display = "none";
      this.initLeaflet();
    }
  },

  // 1. LEAFLET MAP FUNCTIONS
  initLeaflet() {
    if (this.leafletMap) {
      this.leafletMap.remove();
      this.leafletMap = null;
    }

    // Default center at US east coast / mid-atlantic to show all points
    // Center between Atlanta, Orlando, Miami and New York
    this.leafletMap = L.map("leaflet-map").setView([34.0, -80.0], 5);

    // Apply CartoDB Positron style (Muted Gray Apple style)
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const tileUrl = isDark 
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(this.leafletMap);

    this.updateMarkers();
  },

  // 2. GOOGLE MAPS FUNCTIONS
  loadGoogleMapsScript(key) {
    if (this.isGoogleLoaded) {
      this.initGoogleMap();
      return;
    }

    window.initGoogleMapCallback = () => {
      this.isGoogleLoaded = true;
      this.initGoogleMap();
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initGoogleMapCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  },

  initGoogleMap() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const mapOptions = {
      center: { lat: 34.0, lng: -80.0 },
      zoom: 5,
      // Minimalist Clean Apple-like Theme Style for Google Maps
      styles: isDark ? [
        { elementType: "geometry", stylers: [{ color: "#212121" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
        { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] }
      ] : [
        { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] }
      ]
    };

    this.googleMap = new google.maps.Map(document.getElementById("google-map"), mapOptions);
    this.updateMarkers();
  },

  // 3. MARKERS & ROUTES RE-DRAW
  updateMarkers() {
    const timeline = StorageManager.getTimeline();
    const sortedActivities = [];

    // Collect all activities with coordinates
    Object.entries(timeline).forEach(([dateStr, activities]) => {
      // Find matching Day index
      const dayIndex = ItineraryComponent.daysList.findIndex(d => d.dateStr === dateStr) + 1;
      
      activities.forEach(act => {
        if (act.lat && act.lng) {
          sortedActivities.push({
            ...act,
            dateStr,
            dayIndex
          });
        }
      });
    });

    // Sort chronologically (date, then time)
    sortedActivities.sort((a, b) => {
      const dateCompare = a.dateStr.localeCompare(b.dateStr);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    // Update places log in sidebar
    this.renderPlacesSidebar(sortedActivities);

    const isGoogle = (this.googleMap && document.getElementById("google-map").style.display === "block");

    if (isGoogle) {
      this.drawGoogleMarkersAndRoutes(sortedActivities);
    } else {
      this.drawLeafletMarkersAndRoutes(sortedActivities);
    }
  },

  drawLeafletMarkersAndRoutes(activities) {
    // Clear old markers
    this.leafletMarkers.forEach(m => this.leafletMap.removeLayer(m));
    this.leafletMarkers = [];
    
    if (this.routeLine) {
      this.leafletMap.removeLayer(this.routeLine);
      this.routeLine = null;
    }

    const latlngs = [];

    activities.forEach(act => {
      const marker = L.marker([act.lat, act.lng]);
      
      marker.bindPopup(`
        <div style="font-family: -apple-system, sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; color: var(--border-focus);">Day ${act.dayIndex} | ${act.time}</h4>
          <strong style="font-size:13px;">${act.title}</strong>
          <p style="margin: 4px 0 0 0; font-size:11px; color:#555;">📍 ${act.locName}</p>
        </div>
      `);

      marker.addTo(this.leafletMap);
      
      // Store reference to marker by details
      marker.customData = { lat: act.lat, lng: act.lng, name: act.locName };
      this.leafletMarkers.push(marker);

      latlngs.push([act.lat, act.lng]);
    });

    // Draw route connecting lines
    if (latlngs.length > 1) {
      this.routeLine = L.polyline(latlngs, {
        color: "#007aff",
        weight: 3,
        opacity: 0.6,
        dashArray: "6, 6"
      }).addTo(this.leafletMap);
      
      // Auto zoom/fit bounds
      this.leafletMap.fitBounds(this.routeLine.getBounds(), { padding: [40, 40] });
    }
  },

  drawGoogleMarkersAndRoutes(activities) {
    // Clear old markers
    this.googleMarkers.forEach(m => m.setMap(null));
    this.googleMarkers = [];

    if (this.routeLine) {
      this.routeLine.setMap(null);
      this.routeLine = null;
    }

    const bounds = new google.maps.LatLngBounds();
    const coords = [];

    activities.forEach(act => {
      const latlng = { lat: act.lat, lng: act.lng };
      
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: -apple-system, sans-serif; padding: 4px;">
            <h4 style="margin: 0 0 4px 0; color: #007aff;">Day ${act.dayIndex} | ${act.time}</h4>
            <strong style="font-size:13px;">${act.title}</strong>
            <p style="margin: 4px 0 0 0; font-size:11px; color:#555;">📍 ${act.locName}</p>
          </div>
        `
      });

      const marker = new google.maps.Marker({
        position: latlng,
        map: this.googleMap,
        title: act.title
      });

      marker.addListener("click", () => {
        infoWindow.open(this.googleMap, marker);
      });

      marker.customData = { lat: act.lat, lng: act.lng, name: act.locName, infoWindow };
      this.googleMarkers.push(marker);

      coords.push(latlng);
      bounds.extend(latlng);
    });

    // Draw route lines
    if (coords.length > 1) {
      this.routeLine = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: "#007aff",
        strokeOpacity: 0.6,
        strokeWeight: 3,
        map: this.googleMap
      });

      this.googleMap.fitBounds(bounds);
    }
  },

  renderPlacesSidebar(activities) {
    const listContainer = document.getElementById("map-places-list");
    listContainer.innerHTML = "";

    if (activities.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-secondary); font-size: 13px;">
          등록된 방문지가 없습니다. 일정 계획에서 위치를 포함한 활동을 입력해주세요.
        </div>
      `;
      return;
    }

    activities.forEach(act => {
      const card = document.createElement("div");
      card.className = "map-place-card";
      card.innerHTML = `
        <div class="map-place-info">
          <span class="map-place-day">Day ${act.dayIndex} | ${act.time}</span>
          <span class="map-place-title">${act.title}</span>
          <span class="map-place-address">${act.locName}</span>
        </div>
        <span style="font-size: 14px;">🧭</span>
      `;

      card.addEventListener("click", () => {
        this.panTo(act.lat, act.lng, act.locName);
      });

      listContainer.appendChild(card);
    });
  },

  // Pan Map to coordinate and trigger popup
  panTo(lat, lng, name) {
    const isGoogle = (this.googleMap && document.getElementById("google-map").style.display === "block");

    if (isGoogle) {
      if (!this.googleMap) return;
      this.googleMap.setCenter({ lat, lng });
      this.googleMap.setZoom(13);

      // Open infowindow
      const marker = this.googleMarkers.find(m => m.customData.lat === lat && m.customData.lng === lng);
      if (marker && marker.customData.infoWindow) {
        marker.customData.infoWindow.open(this.googleMap, marker);
      }
    } else {
      if (!this.leafletMap) return;
      this.leafletMap.setView([lat, lng], 13);

      // Open popup
      const marker = this.leafletMarkers.find(m => m.customData.lat === lat && m.customData.lng === lng);
      if (marker) {
        marker.openPopup();
      }
    }
  },

  // Fit bounds to all activities on a specific day
  focusOnDay(dateStr) {
    const isGoogle = (this.googleMap && document.getElementById("google-map").style.display === "block");
    
    if (isGoogle) {
      if (!this.googleMap) return;
      const bounds = new google.maps.LatLngBounds();
      let count = 0;
      
      this.googleMarkers.forEach(m => {
        // Find matching activity date
        const timeline = StorageManager.getTimeline();
        const dayActivities = timeline[dateStr] || [];
        const matches = dayActivities.some(act => act.lat === m.position.lat() && act.lng === m.position.lng());
        
        if (matches) {
          bounds.extend(m.position);
          count++;
        }
      });

      if (count > 0) {
        this.googleMap.fitBounds(bounds);
      }
    } else {
      if (!this.leafletMap) return;
      const dayMarkers = this.leafletMarkers.filter(m => {
        const timeline = StorageManager.getTimeline();
        const dayActivities = timeline[dateStr] || [];
        return dayActivities.some(act => act.lat === m.customData.lat && act.lng === m.customData.lng);
      });

      if (dayMarkers.length > 0) {
        const group = L.featureGroup(dayMarkers);
        this.leafletMap.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    }
  }
};
window.MapComponent = MapComponent;
