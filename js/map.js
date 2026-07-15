// USA Travel Planner - Map Component
const MapComponent = {
  leafletMap: null,
  googleMap: null,
  leafletMarkers: [],
  googleMarkers: [],
  selectedCategory: "all",
  isGoogleLoaded: false,

  init() {
    this.bindCategoryEvents();
    this.updateMapMode();
  },

  bindCategoryEvents() {
    // Category tabs filter
    document.querySelectorAll(".map-cat-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".map-cat-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedCategory = btn.dataset.category;
        this.updateMarkers();
      });
    });

    const refreshBtn = document.getElementById("refresh-map-btn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.updateMapMode();
      });
    }
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
    if (typeof L === "undefined") {
      console.warn("Leaflet library is not loaded.");
      const leafletEl = document.getElementById("leaflet-map");
      if (leafletEl) {
        leafletEl.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 24px; text-align: center; color: var(--text-secondary);">
            <span style="font-size: 32px; margin-bottom: 8px;">🌐</span>
            <strong style="font-size: 14px;">지도를 로드할 수 없습니다.</strong>
            <span style="font-size: 11px; margin-top: 4px; line-height:1.4;">인터넷 연결이 원활하지 않거나 오프라인 상태일 수 있습니다. 설정에서 Google Maps API 키를 연동해 보십시오.</span>
          </div>
        `;
      }
      return;
    }

    if (this.leafletMap) {
      this.leafletMap.remove();
      this.leafletMap = null;
    }

    // Default center at New York City Midtown to show saved places
    this.leafletMap = L.map("leaflet-map").setView([40.73, -73.99], 13);

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
      center: { lat: 40.73, lng: -73.99 },
      zoom: 13,
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

  // 3. MARKERS RE-DRAW
  updateMarkers() {
    const places = StorageManager.getGooglePlaces();
    
    // Filter by selected category
    const filteredPlaces = this.selectedCategory === "all" 
      ? places 
      : places.filter(p => p.category === this.selectedCategory);

    // Update places log in sidebar
    this.renderPlacesSidebar(filteredPlaces);

    const isGoogle = (this.googleMap && document.getElementById("google-map").style.display === "block");

    if (isGoogle) {
      this.drawGoogleMarkers(filteredPlaces);
    } else {
      this.drawLeafletMarkers(filteredPlaces);
    }
  },

  drawLeafletMarkers(places) {
    if (typeof L === "undefined" || !this.leafletMap) return;
    
    // Clear old markers
    this.leafletMarkers.forEach(m => this.leafletMap.removeLayer(m));
    this.leafletMarkers = [];

    places.forEach(p => {
      const marker = L.marker([p.lat, p.lng]);
      
      const catLabel = p.category === "food" ? "🍩 맛집/카페" : p.category === "shopping" ? "🛍️ 쇼핑" : "🗽 명소/미술관";
      const catColor = p.category === "food" ? "#af52de" : p.category === "shopping" ? "#007aff" : "#34c759";

      marker.bindPopup(`
        <div style="font-family: -apple-system, sans-serif; padding: 4px; min-width: 160px; line-height: 1.4;">
          <h4 style="margin: 0 0 4px 0; color: ${catColor}; font-size: 11px; font-weight: 700;">${catLabel}</h4>
          <strong style="font-size: 13px; color: #1d1d1f; display: block; margin-bottom: 2px;">${p.name}</strong>
          ${p.note ? `<p style="margin: 4px 0; font-size: 11px; background: rgba(0,0,0,0.04); padding: 4px 6px; border-radius: 4px; border-left: 2px solid ${catColor}; color: #333; font-weight: 500;">${p.note.replace(/\n/g, '<br>')}</p>` : ""}
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #666;">📍 ${p.address}</p>
        </div>
      `);

      marker.addTo(this.leafletMap);
      
      // Store custom data reference
      marker.customData = { lat: p.lat, lng: p.lng, name: p.name };
      this.leafletMarkers.push(marker);
    });
  },

  drawGoogleMarkers(places) {
    // Clear old markers
    this.googleMarkers.forEach(m => m.setMap(null));
    this.googleMarkers = [];

    places.forEach(p => {
      const latlng = { lat: p.lat, lng: p.lng };
      
      const catLabel = p.category === "food" ? "🍩 맛집/카페" : p.category === "shopping" ? "🛍️ 쇼핑" : "🗽 명소/미술관";
      const catColor = p.category === "food" ? "#af52de" : p.category === "shopping" ? "#007aff" : "#34c759";

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: -apple-system, sans-serif; padding: 4px; min-width: 160px; line-height: 1.4;">
            <h4 style="margin: 0 0 4px 0; color: ${catColor}; font-size: 11px; font-weight: 700;">${catLabel}</h4>
            <strong style="font-size: 13px; color: #1d1d1f; display: block; margin-bottom: 2px;">${p.name}</strong>
            ${p.note ? `<p style="margin: 4px 0; font-size: 11px; background: rgba(0,0,0,0.04); padding: 4px 6px; border-radius: 4px; border-left: 2px solid ${catColor}; color: #333; font-weight: 500;">${p.note.replace(/\n/g, '<br>')}</p>` : ""}
            <p style="margin: 4px 0 0 0; font-size: 10px; color: #666;">📍 ${p.address}</p>
          </div>
        `
      });

      const marker = new google.maps.Marker({
        position: latlng,
        map: this.googleMap,
        title: p.name
      });

      marker.addListener("click", () => {
        // Close other open info windows first
        this.googleMarkers.forEach(m => {
          if (m.customData && m.customData.infoWindow) m.customData.infoWindow.close();
        });
        infoWindow.open(this.googleMap, marker);
      });

      marker.customData = { lat: p.lat, lng: p.lng, name: p.name, infoWindow };
      this.googleMarkers.push(marker);
    });
  },

  renderPlacesSidebar(places) {
    const listContainer = document.getElementById("map-places-list");
    listContainer.innerHTML = "";

    if (places.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-secondary); font-size: 12px;">
          선택된 카테고리에 등록된 장소가 없습니다.
        </div>
      `;
      return;
    }

    places.forEach(p => {
      const card = document.createElement("div");
      card.className = "map-place-card";
      
      const catIcon = p.category === "food" ? "🍩" : p.category === "shopping" ? "🛍️" : "🗽";
      const catBadgeClass = p.category; // CSS helper

      card.innerHTML = `
        <div class="map-place-info" style="display: flex; flex-direction: column; gap: 3px; width: 100%;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="map-place-cat-icon" style="font-size: 14px;">${catIcon}</span>
            <span class="map-place-title" style="font-size: 13px; font-weight: 700; color: var(--text-primary);">${p.name}</span>
          </div>
          ${p.note ? `<span class="map-place-note" style="font-size: 11px; color: #bf5f00; font-weight: 500;">💡 ${p.note.replace(/\n/g, ' ')}</span>` : ""}
          <span class="map-place-address" style="font-size: 10px; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.address}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        this.panTo(p.lat, p.lng, p.name);
      });

      listContainer.appendChild(card);
    });
  },

  // Pan Map to coordinate and trigger popup
  panTo(lat, lng, name) {
    const isGoogle = (this.googleMap && document.getElementById("google-map").style.display === "block");

    if (isGoogle) {
      if (!this.googleMap) return;
      this.googleMap.panTo({ lat, lng });
      this.googleMap.setZoom(15);
      
      // Auto trigger infowindow
      const marker = this.googleMarkers.find(m => m.customData.lat === lat && m.customData.lng === lng);
      if (marker && marker.customData.infoWindow) {
        // Close others
        this.googleMarkers.forEach(m => {
          if (m.customData && m.customData.infoWindow) m.customData.infoWindow.close();
        });
        marker.customData.infoWindow.open(this.googleMap, marker);
      }
    } else {
      if (!this.leafletMap) return;
      this.leafletMap.setView([lat, lng], 15);
      
      // Auto trigger popup
      const marker = this.leafletMarkers.find(m => m.customData.lat === lat && m.customData.lng === lng);
      if (marker) {
        marker.openPopup();
      }
    }
  }
};
window.MapComponent = MapComponent;
