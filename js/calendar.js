// USA Travel Planner - Calendar Component
const CalendarComponent = {
  currentYear: 2026,
  currentMonth: 9, // 0-indexed, so 9 is October

  init() {
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById("prev-month-btn").addEventListener("click", () => {
      this.changeMonth(-1);
    });
    document.getElementById("next-month-btn").addEventListener("click", () => {
      this.changeMonth(1);
    });
    document.getElementById("today-btn").addEventListener("click", () => {
      // Set to October 2026 (the trip month) or actual today
      this.currentYear = 2026;
      this.currentMonth = 9;
      this.render();
    });

    // Calendar Modal controls
    const modal = document.getElementById("calendar-event-modal");
    const closeBtn = document.getElementById("close-calendar-modal-btn");
    const cancelBtn = document.getElementById("cancel-calendar-modal-btn");
    const saveBtn = document.getElementById("save-calendar-event-btn");
    const deleteBtn = document.getElementById("delete-calendar-event-btn");
    const typeSelect = document.getElementById("cal-event-type");

    closeBtn.addEventListener("click", () => this.closeModal());
    cancelBtn.addEventListener("click", () => this.closeModal());
    
    // Toggle conditional fields in event form
    typeSelect.addEventListener("change", (e) => {
      this.toggleFormFields(e.target.value);
    });

    saveBtn.addEventListener("click", () => this.saveEvent());
    deleteBtn.addEventListener("click", () => this.deleteEvent());

    // Add event floating button
    document.getElementById("add-calendar-event-btn").addEventListener("click", () => {
      this.openModalForAdd(new Date(2026, 9, 14).toISOString().split("T")[0]);
    });
  },

  changeMonth(direction) {
    this.currentMonth += direction;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    }
    this.render();
  },

  toggleFormFields(type) {
    const endDateGroup = document.getElementById("cal-event-end-date-group");
    const durationGroup = document.getElementById("cal-event-duration-group");
    const destGroup = document.getElementById("cal-event-dest-group");

    endDateGroup.style.display = (type === "accommodation") ? "block" : "none";
    durationGroup.style.display = (type === "roadtrip") ? "block" : "none";
    destGroup.style.display = (type === "roadtrip") ? "block" : "none";
  },

  render() {
    const grid = document.getElementById("calendar-grid");
    const monthTitle = document.getElementById("calendar-month-title");
    
    grid.innerHTML = "";
    
    // Set header month/year title
    monthTitle.innerText = `${this.currentYear}년 ${this.currentMonth + 1}월`;

    // Weekday headers
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    weekdays.forEach(day => {
      const header = document.createElement("div");
      header.className = "calendar-day-header";
      header.innerText = day;
      grid.appendChild(header);
    });

    // Calendar logic
    const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(this.currentYear, this.currentMonth, 0).getDate();

    const events = StorageManager.getEvents();

    // Render cells
    // 1. Previous month padded days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
      const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
      const dateStr = this.formatDateString(prevYear, prevMonth, dayNum);
      
      const cell = this.createCell(dayNum, dateStr, true, events);
      grid.appendChild(cell);
    }

    // 2. Current month days
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const dateStr = this.formatDateString(this.currentYear, this.currentMonth, dayNum);
      const isToday = this.isToday(this.currentYear, this.currentMonth, dayNum);
      
      const cell = this.createCell(dayNum, dateStr, false, events, isToday);
      grid.appendChild(cell);
    }

    // 3. Next month padded days to complete grid (usually 42 cells total)
    const totalCellsRenderedSoFar = firstDayIndex + totalDays;
    const remainingCells = totalCellsRenderedSoFar <= 35 ? 35 - totalCellsRenderedSoFar : 42 - totalCellsRenderedSoFar;
    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
      const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
      const dateStr = this.formatDateString(nextYear, nextMonth, dayNum);
      
      const cell = this.createCell(dayNum, dateStr, true, events);
      grid.appendChild(cell);
    }
  },

  formatDateString(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  },

  isToday(year, month, day) {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  },

  createCell(dayNum, dateStr, isOtherMonth, events, isToday = false) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    if (isOtherMonth) cell.classList.add("other-month");
    if (isToday) cell.classList.add("today");

    cell.dataset.date = dateStr;

    // Cell Click -> Open Add Modal
    cell.addEventListener("click", (e) => {
      if (e.target.classList.contains("badge-event") || e.target.closest(".badge-event")) {
        return; // Don't trigger cell click on event badge click
      }
      this.openModalForAdd(dateStr);
    });

    // Date display
    const numContainer = document.createElement("div");
    numContainer.className = "day-number-container";
    
    const numSpan = document.createElement("span");
    numSpan.className = "day-number";
    numSpan.innerText = `${dayNum}일`;
    
    numContainer.appendChild(numSpan);
    cell.appendChild(numContainer);

    // Filter events for this day
    const dayEvents = events.filter(ev => {
      if (ev.type === "accommodation") {
        return dateStr >= ev.date && dateStr <= ev.endDate;
      }
      return ev.date === dateStr;
    });

    const eventsContainer = document.createElement("div");
    eventsContainer.className = "events-list";

    // 1. Group City / Roadtrip Badges for side-by-side rendering (exactly like the screenshot)
    const cityRoadEvents = dayEvents.filter(ev => ev.type === "city" || ev.type === "roadtrip");
    if (cityRoadEvents.length > 0) {
      const badgeRow = document.createElement("div");
      badgeRow.className = "badge-row";
      badgeRow.style.display = "flex";
      badgeRow.style.flexWrap = "wrap";
      badgeRow.style.gap = "3px";
      badgeRow.style.alignItems = "center";

      cityRoadEvents.forEach(ev => {
        const badge = document.createElement("span");
        badge.className = `badge-city color-${ev.color}`;
        badge.innerText = ev.title;
        badge.title = ev.title;

        // Custom roadtrip styling
        if (ev.type === "roadtrip") {
          badge.className = "badge-event badge-roadtrip";
          badge.innerHTML = `🏁 ${ev.title}`;
          badge.style.padding = "2px 4px";
          badge.style.fontSize = "10px";
        }

        badge.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openModalForEdit(ev.id);
        });

        badgeRow.appendChild(badge);
      });
      eventsContainer.appendChild(badgeRow);

      // 2. Sub-labels (e.g., Roadtrip duration "🚗7시간 30분", Flight info "*아침 비행기표")
      cityRoadEvents.forEach(ev => {
        if (ev.type === "roadtrip" && ev.duration) {
          const subText = document.createElement("div");
          subText.style.fontSize = "10px";
          subText.style.fontWeight = "600";
          subText.style.marginTop = "2px";
          subText.innerHTML = `🚗${ev.duration}`;
          eventsContainer.appendChild(subText);
        }
        if (ev.label) {
          const labelText = document.createElement("div");
          labelText.style.fontSize = "10px";
          labelText.style.color = ev.color === "pink" ? "var(--color-pink)" : "var(--text-secondary)";
          labelText.style.fontWeight = "600";
          labelText.style.marginTop = "2px";
          labelText.innerText = ev.label;
          eventsContainer.appendChild(labelText);
        }
      });
    }

    // 3. Other Events (Activities: Golf, Niagara Falls, Halloween)
    const activityEvents = dayEvents.filter(ev => ev.type === "activity");
    activityEvents.forEach(ev => {
      const badge = document.createElement("div");
      badge.className = `badge-event badge-activity color-${ev.color}`;
      badge.innerText = ev.title;

      badge.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openModalForEdit(ev.id);
      });
      eventsContainer.appendChild(badge);
    });

    // 4. Accommodations (Banners spanning multiple days, bottom aligned)
    const accommodationEvents = dayEvents.filter(ev => ev.type === "accommodation");
    accommodationEvents.forEach(ev => {
      const badge = document.createElement("div");
      badge.className = `badge-event badge-accommodation`;
      
      // Determine flat-edges class for continuous span illusion
      if (ev.date === ev.endDate) {
        // Single day
      } else if (dateStr === ev.date) {
        badge.classList.add("span-start");
      } else if (dateStr === ev.endDate) {
        badge.classList.add("span-end");
      } else {
        badge.classList.add("span-mid");
      }
      
      badge.innerText = ev.title;

      badge.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openModalForEdit(ev.id);
      });
      eventsContainer.appendChild(badge);
    });

    cell.appendChild(eventsContainer);
    return cell;
  },

  openModalForAdd(dateStr) {
    const modal = document.getElementById("calendar-event-modal");
    document.getElementById("calendar-modal-title").innerText = "새 일정 추가";
    document.getElementById("cal-event-id").value = "";
    document.getElementById("cal-event-title").value = "";
    document.getElementById("cal-event-type").value = "city";
    document.getElementById("cal-event-color").value = "teal";
    document.getElementById("cal-event-date").value = dateStr;
    document.getElementById("cal-event-end-date").value = dateStr;
    document.getElementById("cal-event-duration").value = "";
    document.getElementById("cal-event-dest").value = "";
    document.getElementById("cal-event-label").value = "";

    document.getElementById("delete-calendar-event-btn").style.display = "none";
    this.toggleFormFields("city");
    
    modal.classList.add("active");
  },

  openModalForEdit(eventId) {
    const events = StorageManager.getEvents();
    const ev = events.find(item => item.id === eventId);
    if (!ev) return;

    const modal = document.getElementById("calendar-event-modal");
    document.getElementById("calendar-modal-title").innerText = "일정 수정/삭제";
    document.getElementById("cal-event-id").value = ev.id;
    document.getElementById("cal-event-title").value = ev.title;
    document.getElementById("cal-event-type").value = ev.type;
    document.getElementById("cal-event-color").value = ev.color;
    document.getElementById("cal-event-date").value = ev.date;
    document.getElementById("cal-event-end-date").value = ev.endDate || ev.date;
    document.getElementById("cal-event-duration").value = ev.duration || "";
    document.getElementById("cal-event-dest").value = ev.destination || "";
    document.getElementById("cal-event-label").value = ev.label || "";

    document.getElementById("delete-calendar-event-btn").style.display = "inline-flex";
    this.toggleFormFields(ev.type);

    modal.classList.add("active");
  },

  closeModal() {
    document.getElementById("calendar-event-modal").classList.remove("active");
  },

  saveEvent() {
    const id = document.getElementById("cal-event-id").value;
    const title = document.getElementById("cal-event-title").value.trim();
    const type = document.getElementById("cal-event-type").value;
    const color = document.getElementById("cal-event-color").value;
    const date = document.getElementById("cal-event-date").value;
    const endDate = document.getElementById("cal-event-end-date").value;
    const duration = document.getElementById("cal-event-duration").value.trim();
    const destination = document.getElementById("cal-event-dest").value.trim();
    const label = document.getElementById("cal-event-label").value.trim();

    if (!title || !date) {
      alert("제목과 날짜를 입력해주세요.");
      return;
    }

    let events = StorageManager.getEvents();

    if (id) {
      // Edit
      events = events.map(ev => {
        if (ev.id === id) {
          const updated = { ...ev, title, type, color, date, label };
          if (type === "accommodation") updated.endDate = endDate;
          if (type === "roadtrip") {
            updated.duration = duration;
            updated.destination = destination;
          }
          return updated;
        }
        return ev;
      });
      App.showNotification("일정이 성공적으로 수정되었습니다.");
    } else {
      // Add
      const newEvent = {
        id: "ev_" + Date.now(),
        title,
        type,
        color,
        date,
        label
      };
      if (type === "accommodation") newEvent.endDate = endDate;
      if (type === "roadtrip") {
        newEvent.duration = duration;
        newEvent.destination = destination;
      }
      events.push(newEvent);
      App.showNotification("새 일정이 추가되었습니다.");
    }

    StorageManager.saveEvents(events);
    this.render();
    this.closeModal();

    // Trigger update on other modules
    if (window.ItineraryComponent) ItineraryComponent.render();
    if (window.MapComponent) MapComponent.updateMarkers();
  },

  deleteEvent() {
    const id = document.getElementById("cal-event-id").value;
    if (!id) return;

    if (!confirm("정말 이 일정을 삭제하시겠습니까?")) return;

    let events = StorageManager.getEvents();
    events = events.filter(ev => ev.id !== id);
    StorageManager.saveEvents(events);
    
    App.showNotification("일정이 삭제되었습니다.");
    this.render();
    this.closeModal();

    // Trigger update on other modules
    if (window.ItineraryComponent) ItineraryComponent.render();
    if (window.MapComponent) MapComponent.updateMarkers();
  }
};
window.CalendarComponent = CalendarComponent;
