// USA Travel Planner - Itinerary Component
const ItineraryComponent = {
  selectedDate: "2026-10-15", // Default starts on Day 1
  daysList: [],
  editingIndex: null,
  editingDate: null,

  init() {
    const details = StorageManager.getTripDetails();
    this.selectedDate = details.startDate || "2026-10-14";
    this.calculateDays();
    this.render();
    this.bindEvents();
  },

  calculateDays() {
    const details = StorageManager.getTripDetails();
    const startParts = (details.startDate || "2026-10-14").split("-");
    const year = parseInt(startParts[0]);
    const month = parseInt(startParts[1]) - 1; // 0-indexed
    const day = parseInt(startParts[2]);

    const startDate = new Date(year, month, day);
    const daysCount = 20;
    this.daysList = [];

    const weekdaysKOR = ["일", "월", "화", "수", "목", "금", "토"];

    for (let i = 0; i < daysCount; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      
      const y = current.getFullYear();
      const m = current.getMonth() + 1;
      const d = current.getDate();
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayName = weekdaysKOR[current.getDay()];

      this.daysList.push({
        dayIndex: i + 1,
        dateStr,
        displayLabel: `${m}월 ${d}일 (${dayName})`
      });
    }
  },

  bindEvents() {
    // Add activity modal events
    const modal = document.getElementById("timeline-item-modal");
    const closeBtn = document.getElementById("close-timeline-modal-btn");
    const cancelBtn = document.getElementById("cancel-timeline-modal-btn");
    const saveBtn = document.getElementById("save-timeline-item-btn");

    closeBtn.addEventListener("click", () => this.closeModal());
    cancelBtn.addEventListener("click", () => this.closeModal());
    saveBtn.addEventListener("click", () => this.saveTimelineItem());

    document.getElementById("add-timeline-item-btn").addEventListener("click", () => {
      this.openModalForAdd();
    });
  },

  render() {
    this.renderDaysSelector();
    this.renderTimeline();
  },

  renderDaysSelector() {
    const listContainer = document.getElementById("days-selector-list");
    listContainer.innerHTML = "";

    const events = StorageManager.getEvents();

    this.daysList.forEach(day => {
      const tab = document.createElement("div");
      tab.className = `day-tab ${day.dateStr === this.selectedDate ? "active" : ""}`;
      
      // Determine what city they are in on this day from Events
      const cityEvent = events.find(ev => ev.type === "city" && ev.date === day.dateStr);
      let cityTagHTML = "";
      if (cityEvent) {
        cityTagHTML = `<span class="day-tab-city color-${cityEvent.color}">${cityEvent.title}</span>`;
      }

      tab.innerHTML = `
        <div class="day-tab-num">Day ${day.dayIndex}</div>
        <div class="day-tab-info">
          <span>${day.displayLabel}</span>
          ${cityTagHTML}
        </div>
      `;

      tab.addEventListener("click", () => {
        this.selectedDate = day.dateStr;
        this.render();
        // Highlight place on map if selected
        if (window.MapComponent && App.currentTab === "map-tab") {
          MapComponent.focusOnDay(this.selectedDate);
        }
      });

      listContainer.appendChild(tab);
    });
  },

  renderTimeline() {
    const timelineContainer = document.getElementById("daily-timeline-list");
    const dayTitle = document.getElementById("current-day-title");
    const daySubtitle = document.getElementById("current-day-subtitle");

    timelineContainer.innerHTML = "";

    const dayInfo = this.daysList.find(d => d.dateStr === this.selectedDate);
    if (!dayInfo) return;

    // Header Title
    dayTitle.innerText = `Day ${dayInfo.dayIndex}: ${dayInfo.displayLabel}`;
    
    // Subtitle (Find City)
    const events = StorageManager.getEvents();
    const cityEvent = events.find(ev => ev.type === "city" && ev.date === this.selectedDate);
    daySubtitle.innerText = cityEvent ? `${cityEvent.title} 일정` : "자유 일정";

    // Read activities
    const timelineData = StorageManager.getTimeline();
    const dayActivities = timelineData[this.selectedDate] || [];

    // Sort by time
    dayActivities.sort((a, b) => a.time.localeCompare(b.time));

    if (dayActivities.length === 0) {
      timelineContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
          <span style="font-size: 32px;">📭</span>
          <p style="margin-top: 10px; font-size: 14px;">등록된 일정이 없습니다. 우측 상단의 '+ 활동 추가' 버튼을 눌러 등록해주세요.</p>
        </div>
      `;
      return;
    }

    // Special layout for Day 1: Split between Korea (Departure) and USA (Arrival)
    if (dayInfo.dayIndex === 1) {
      const splitWrapper = document.createElement("div");
      splitWrapper.className = "timeline-split-wrapper";
      
      const leftCol = document.createElement("div");
      leftCol.className = "timeline-column";
      leftCol.innerHTML = `<h3 class="timeline-col-header korea-header">🇰🇷 한국 (출발)</h3>`;
      
      const rightCol = document.createElement("div");
      rightCol.className = "timeline-column";
      rightCol.innerHTML = `<h3 class="timeline-col-header usa-header">🇺🇸 미국 (도착)</h3>`;
      
      dayActivities.forEach((act, idx) => {
        const item = document.createElement("div");
        item.className = "timeline-item";

        const isDraft = act.isDraft !== false; // By default true unless set to false
        if (isDraft) {
          item.style.opacity = "0.62";
        } else {
          item.style.opacity = "1";
        }

        const locBtnHTML = act.locName ? `
          <div class="timeline-location" data-lat="${act.lat}" data-lng="${act.lng}" data-name="${act.locName}">
            📍 ${act.locName}
          </div>
        ` : "";

        item.innerHTML = `
          <div class="timeline-node"></div>
          <div class="timeline-content">
            <div class="timeline-info">
              <span class="timeline-time">${act.time}</span>
              <span class="timeline-title">
                ${act.title}
                ${isDraft ? `<span style="font-size: 9px; color: #8e8e93; border: 1px solid #d1d1d6; background: var(--bg-secondary); padding: 1px 4px; border-radius: 4px; font-weight: 600; margin-left: 6px;">임시</span>` : ""}
              </span>
              ${act.desc ? `<span class="timeline-desc">${act.desc}</span>` : ""}
              ${locBtnHTML}
            </div>
            <div class="timeline-actions">
              <button class="btn-icon edit" title="수정" style="font-size: 11px; margin-right: 4px; cursor: pointer;">✏️</button>
              <button class="btn-icon delete" title="삭제" style="font-size: 11px; cursor: pointer;">🗑️</button>
            </div>
          </div>
        `;

        const locBtn = item.querySelector(".timeline-location");
        if (locBtn) {
          locBtn.addEventListener("click", () => {
            const lat = parseFloat(locBtn.dataset.lat);
            const lng = parseFloat(locBtn.dataset.lng);
            const name = locBtn.dataset.name;
            App.switchTab("map-tab");
            if (window.MapComponent) {
              MapComponent.panTo(lat, lng, name);
            }
          });
        }

        item.querySelector(".btn-icon.edit").addEventListener("click", () => {
          this.openModalForEdit(this.selectedDate, idx);
        });

        item.querySelector(".btn-icon.delete").addEventListener("click", () => {
          this.deleteTimelineItem(idx);
        });

        // Split criteria: Korea vs USA
        const actTitle = act.title || "";
        const actLoc = act.locName || "";
        const isKorea = actTitle.includes("인천") || actTitle.includes("대한항공") || actTitle.includes("이륙") || actTitle.includes("출발") || actLoc.includes("Incheon") || actLoc.includes("인천");
        if (isKorea) {
          leftCol.appendChild(item);
        } else {
          rightCol.appendChild(item);
        }
      });
      
      splitWrapper.appendChild(leftCol);
      splitWrapper.appendChild(rightCol);
      timelineContainer.appendChild(splitWrapper);
      return;
    }

    // Default layout for other days
    dayActivities.forEach((act, idx) => {
      const item = document.createElement("div");
      item.className = "timeline-item";

      const isDraft = act.isDraft !== false; // By default true unless set to false
      if (isDraft) {
        item.style.opacity = "0.62";
      } else {
        item.style.opacity = "1";
      }

      const locBtnHTML = act.locName ? `
        <div class="timeline-location" data-lat="${act.lat}" data-lng="${act.lng}" data-name="${act.locName}">
          📍 ${act.locName}
        </div>
      ` : "";

      item.innerHTML = `
        <div class="timeline-node"></div>
        <div class="timeline-content">
          <div class="timeline-info">
            <span class="timeline-time">${act.time}</span>
            <span class="timeline-title">
              ${act.title}
              ${isDraft ? `<span style="font-size: 9px; color: #8e8e93; border: 1px solid #d1d1d6; background: var(--bg-secondary); padding: 1px 4px; border-radius: 4px; font-weight: 600; margin-left: 6px;">임시</span>` : ""}
            </span>
            ${act.desc ? `<span class="timeline-desc">${act.desc}</span>` : ""}
            ${locBtnHTML}
          </div>
          <div class="timeline-actions">
            <button class="btn-icon edit" title="수정" style="font-size: 11px; margin-right: 4px; cursor: pointer;">✏️</button>
            <button class="btn-icon delete" title="삭제" style="font-size: 11px; cursor: pointer;">🗑️</button>
          </div>
        </div>
      `;

      const locBtn = item.querySelector(".timeline-location");
      if (locBtn) {
        locBtn.addEventListener("click", () => {
          const lat = parseFloat(locBtn.dataset.lat);
          const lng = parseFloat(locBtn.dataset.lng);
          const name = locBtn.dataset.name;
          App.switchTab("map-tab");
          if (window.MapComponent) {
            MapComponent.panTo(lat, lng, name);
          }
        });
      }

      item.querySelector(".btn-icon.edit").addEventListener("click", () => {
        this.openModalForEdit(this.selectedDate, idx);
      });

      item.querySelector(".btn-icon.delete").addEventListener("click", () => {
        this.deleteTimelineItem(idx);
      });

      timelineContainer.appendChild(item);
    });
  },

  openModalForAdd() {
    this.editingIndex = null;
    this.editingDate = null;

    const modal = document.getElementById("timeline-item-modal");
    document.getElementById("timeline-modal-title").innerText = "새 활동 추가";
    document.getElementById("timeline-item-index").value = "";
    document.getElementById("timeline-item-date").value = this.selectedDate;
    document.getElementById("timeline-item-time").value = "10:00";
    document.getElementById("timeline-item-title").value = "";
    document.getElementById("timeline-item-desc").value = "";
    
    // Auto-fill typical coordinates based on active city
    const events = StorageManager.getEvents();
    const cityEvent = events.find(ev => ev.type === "city" && ev.date === this.selectedDate);
    let lat = 40.7128, lng = -74.0060; // NYC Default
    if (cityEvent && cityEvent.title) {
      const cityTitle = cityEvent.title;
      if (cityTitle.includes("애틀랜타")) { lat = 33.7490; lng = -84.3880; }
      else if (cityTitle.includes("올랜도") || cityTitle.includes("올랜드")) { lat = 28.5383; lng = -81.3792; }
      else if (cityTitle.includes("마이애미")) { lat = 25.7617; lng = -80.1918; }
    }
    
    document.getElementById("timeline-item-loc").value = "";
    document.getElementById("timeline-item-lat").value = lat;
    document.getElementById("timeline-item-lng").value = lng;

    modal.classList.add("active");
  },

  openModalForEdit(date, idx) {
    const timelineData = StorageManager.getTimeline();
    const dayActivities = timelineData[date] || [];
    dayActivities.sort((a, b) => a.time.localeCompare(b.time));
    const act = dayActivities[idx];
    if (!act) return;

    this.editingIndex = idx;
    this.editingDate = date;

    const modal = document.getElementById("timeline-item-modal");
    document.getElementById("timeline-modal-title").innerText = "활동 수정";
    document.getElementById("timeline-item-index").value = idx;
    document.getElementById("timeline-item-date").value = date;
    document.getElementById("timeline-item-time").value = act.time;
    document.getElementById("timeline-item-title").value = act.title;
    document.getElementById("timeline-item-desc").value = act.desc || "";
    document.getElementById("timeline-item-loc").value = act.locName || "";
    document.getElementById("timeline-item-lat").value = act.lat || "";
    document.getElementById("timeline-item-lng").value = act.lng || "";

    modal.classList.add("active");
  },

  closeModal() {
    document.getElementById("timeline-item-modal").classList.remove("active");
    this.editingIndex = null;
    this.editingDate = null;
  },

  saveTimelineItem() {
    const date = document.getElementById("timeline-item-date").value;
    const time = document.getElementById("timeline-item-time").value;
    const title = document.getElementById("timeline-item-title").value.trim();
    const desc = document.getElementById("timeline-item-desc").value.trim();
    const locName = document.getElementById("timeline-item-loc").value.trim();
    const latVal = document.getElementById("timeline-item-lat").value;
    const lngVal = document.getElementById("timeline-item-lng").value;

    if (!title || !time || !locName || !latVal || !lngVal) {
      alert("모든 필수 입력 항목을 채워주세요.");
      return;
    }

    const lat = parseFloat(latVal);
    const lng = parseFloat(lngVal);

    const timelineData = StorageManager.getTimeline();
    
    if (this.editingIndex !== null && this.editingDate !== null) {
      // Editing Mode
      const dayActivities = timelineData[this.editingDate] || [];
      dayActivities.sort((a, b) => a.time.localeCompare(b.time));
      
      const updatedItem = {
        time,
        title,
        desc,
        locName,
        lat,
        lng,
        isDraft: false // Mark as confirmed once edited!
      };

      if (date === this.editingDate) {
        dayActivities[this.editingIndex] = updatedItem;
      } else {
        // Date changed
        dayActivities.splice(this.editingIndex, 1);
        if (!timelineData[date]) timelineData[date] = [];
        timelineData[date].push(updatedItem);
      }
      
      App.showNotification("일정이 수정되었습니다.");
    } else {
      // Adding Mode
      if (!timelineData[date]) {
        timelineData[date] = [];
      }
      const newItem = {
        time,
        title,
        desc,
        locName,
        lat,
        lng,
        isDraft: false // Mark user additions as confirmed
      };
      timelineData[date].push(newItem);
      App.showNotification("새 일정이 추가되었습니다.");
    }

    StorageManager.saveTimeline(timelineData);
    this.render();
    this.closeModal();

    if (window.MapComponent) {
      MapComponent.updateMarkers();
    }
  },

  deleteTimelineItem(index) {
    if (!confirm("정말 이 활동을 삭제하시겠습니까?")) return;

    const timelineData = StorageManager.getTimeline();
    const dayActivities = timelineData[this.selectedDate] || [];

    // Sort by time first to match the rendered index
    dayActivities.sort((a, b) => a.time.localeCompare(b.time));

    dayActivities.splice(index, 1);
    timelineData[this.selectedDate] = dayActivities;
    
    StorageManager.saveTimeline(timelineData);
    App.showNotification("활동이 삭제되었습니다.");
    this.render();

    // Trigger update on map marker
    if (window.MapComponent) {
      MapComponent.updateMarkers();
    }
  }
};
window.ItineraryComponent = ItineraryComponent;
