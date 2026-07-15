// USA Travel Planner - Tickets Component
const TicketsComponent = {
  activeFilter: "all",
  categories: {
    flight: { label: "항공권", color: "#007aff", bg: "rgba(0, 122, 255, 0.05)", emoji: "✈️" },
    museum: { label: "미술관/공연", color: "#af52de", bg: "rgba(175, 82, 222, 0.05)", emoji: "🏛️" },
    activity: { label: "액티비티/골프", color: "#34c759", bg: "rgba(52, 199, 89, 0.05)", emoji: "⛳️" },
    etc: { label: "기타 예약", color: "#8e8e93", bg: "rgba(142, 142, 147, 0.05)", emoji: "🎫" }
  },

  init() {
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    // Category Filter Clicks
    const filterButtons = document.querySelectorAll("#ticket-filter-bar .filter-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => {
          b.classList.remove("active");
          b.style.background = "transparent";
          b.style.color = "var(--text-secondary)";
          b.style.fontWeight = "500";
        });
        
        btn.classList.add("active");
        btn.style.background = "var(--bg-secondary)";
        btn.style.color = "var(--text-primary)";
        btn.style.fontWeight = "600";

        this.activeFilter = btn.dataset.category;
        this.render();
      });
    });

    // Modal Toggle controls
    const modal = document.getElementById("ticket-modal");
    const closeBtn = document.getElementById("close-ticket-modal-btn");
    const cancelBtn = document.getElementById("cancel-ticket-modal-btn");
    const saveBtn = document.getElementById("save-ticket-btn");
    const deleteBtn = document.getElementById("delete-ticket-btn");

    closeBtn.addEventListener("click", () => this.closeModal());
    cancelBtn.addEventListener("click", () => this.closeModal());
    saveBtn.addEventListener("click", () => this.saveTicket());
    deleteBtn.addEventListener("click", () => this.deleteTicket());

    document.getElementById("add-ticket-btn").addEventListener("click", () => {
      this.openModalForAdd();
    });

    // Category Change Flight fields toggle
    const categorySelect = document.getElementById("ticket-category");
    const flightFields = document.getElementById("flight-fields-group");
    
    const toggleFlightFields = () => {
      if (categorySelect.value === "flight") {
        flightFields.style.display = "grid";
      } else {
        flightFields.style.display = "none";
      }
    };
    
    categorySelect.addEventListener("change", toggleFlightFields);

    // Image file upload handler (Convert to Base64)
    const fileInput = document.getElementById("ticket-image-file");
    const base64Input = document.getElementById("ticket-image-base64");
    
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 1.5 * 1024 * 1024) {
          alert("파일 크기가 너무 큽니다 (1.5MB 이하의 이미지만 업로드 가능합니다). 모바일 브라우저 한계로 인해 큰 파일은 이미지 URL 입력을 권장합니다.");
          fileInput.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          base64Input.value = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Close full screen viewer
    document.getElementById("close-ticket-viewer-btn").addEventListener("click", () => {
      document.getElementById("ticket-image-viewer-modal").classList.remove("active");
    });
    document.getElementById("ticket-image-viewer-modal").addEventListener("click", (e) => {
      if (e.target.id === "ticket-image-viewer-modal") {
        document.getElementById("ticket-image-viewer-modal").classList.remove("active");
      }
    });
  },

  render() {
    const container = document.getElementById("tickets-list-container");
    container.innerHTML = "";

    const tickets = StorageManager.getTickets();

    // 1. Filter tickets
    let filteredTickets = tickets;
    if (this.activeFilter !== "all") {
      filteredTickets = tickets.filter(t => t.category === this.activeFilter);
    }

    // 2. Sort chronologically by date and time
    filteredTickets.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    // 3. Render
    if (filteredTickets.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 24px; color: var(--text-secondary);">
          <span style="font-size: 40px;">🎟️</span>
          <p style="margin-top: 12px; font-size: 14px; font-weight: 500;">이 카테고리에 등록된 티켓이 없습니다.</p>
          <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">우측 상단의 '+ 티켓 등록' 버튼을 눌러 비행기표나 미술관 티켓을 추가해 보세요.</p>
        </div>
      `;
      return;
    }

    filteredTickets.forEach(ticket => {
      const catInfo = this.categories[ticket.category] || this.categories.etc;
      const card = document.createElement("div");
      
      // Apple Wallet Pass layout
      card.className = "ticket-pass-card";
      card.style.setProperty("--ticket-accent", catInfo.color);
      
      // Check if image exists
      const hasImage = ticket.imageUrl || ticket.imageBase64;
      const imgBtnHTML = hasImage ? `
        <button class="btn btn-sm ticket-img-view-btn" style="padding: 4px 8px; font-size: 11px; margin-top: 8px; cursor: pointer;">
          🖼️ 티켓 원본 보기
        </button>
      ` : `<span style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px; display: inline-block;">첨부 이미지 없음</span>`;

      // Date conversion to beautiful Korean format
      const dateParts = ticket.date.split("-");
      const formattedDate = `${dateParts[1]}월 ${dateParts[2]}일`;

      let passBodyHTML = "";

      if (ticket.category === "flight") {
        const departure = ticket.depCode || "ICN";
        const destination = ticket.arrCode || "ATL";
        const flightNo = ticket.flightNo || "";

        passBodyHTML = `
          <!-- Boarding pass style FROM / TO -->
          <div class="flight-segment" style="display: flex; align-items: center; justify-content: space-between; margin: 10px 0; padding: 4px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
            <div style="text-align: left;">
              <span style="display: block; font-size: 9px; color: var(--text-secondary); font-weight: 600; letter-spacing: 0.5px;">FROM</span>
              <span style="font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: 0.5px;">${departure}</span>
            </div>
            <div style="font-size: 18px; color: var(--ticket-accent); display: flex; flex-direction: column; align-items: center; gap: 2px;">
              <span>✈️</span>
              ${flightNo ? `<span style="font-size: 8.5px; color: var(--ticket-accent); font-weight: 700; background: ${catInfo.bg}; padding: 1px 8px; border-radius: 10px; border: 1px solid ${catInfo.color};">${flightNo}</span>` : ""}
            </div>
            <div style="text-align: right;">
              <span style="display: block; font-size: 9px; color: var(--text-secondary); font-weight: 600; letter-spacing: 0.5px;">TO</span>
              <span style="font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: 0.5px;">${destination}</span>
            </div>
          </div>
          
          <div class="ticket-info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
            <div>
              <span class="label" style="display: block; font-size: 9px; color: var(--text-secondary); font-weight: 600;">DATE</span>
              <span class="val" style="font-size: 13px; font-weight: 700;">${formattedDate}</span>
            </div>
            <div>
              <span class="label" style="display: block; font-size: 9px; color: var(--text-secondary); font-weight: 600;">TIME</span>
              <span class="val" style="font-size: 13px; font-weight: 700;">${ticket.time}</span>
            </div>
          </div>
        `;
      } else {
        passBodyHTML = `
          <div class="ticket-info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px;">
            <div>
              <span class="label" style="display: block; font-size: 9px; color: var(--text-secondary); font-weight: 600;">DATE</span>
              <span class="val" style="font-size: 13px; font-weight: 700;">${formattedDate}</span>
            </div>
            <div>
              <span class="label" style="display: block; font-size: 9px; color: var(--text-secondary); font-weight: 600;">TIME</span>
              <span class="val" style="font-size: 13px; font-weight: 700;">${ticket.time}</span>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="ticket-header-strip">
          <span style="font-size: 16px;">${catInfo.emoji}</span>
          <span style="font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
            ${catInfo.label} PASS
          </span>
        </div>
        <div class="ticket-body-content">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h3 class="ticket-title-text" title="${ticket.title}">${ticket.title}</h3>
            <button class="btn-icon edit-tkt-btn" style="font-size: 12px;">✏️</button>
          </div>
          
          ${passBodyHTML}
          
          <div style="margin-top: 12px; border-top: 1px dashed var(--border-color); padding-top: 10px;">
            <span class="label" style="display: block; font-size: 9px; color: var(--text-secondary); font-weight: 600; margin-bottom: 2px;">RESERVATION INFO</span>
            <div class="val" style="font-size: 12px; line-height: 1.4; color: var(--text-primary); white-space: pre-line; font-weight: 500;">${ticket.details}</div>
          </div>

          ${ticket.memo ? `
            <div style="margin-top: 8px; background: rgba(0,0,0,0.02); padding: 6px 10px; border-radius: 6px;">
              <span style="font-size: 11px; color: var(--text-secondary); line-height: 1.3; display: block;">💡 ${ticket.memo}</span>
            </div>
          ` : ""}

          <!-- Dotted punchline -->
          <div style="border-top: 2px dashed var(--border-color); margin: 16px -16px 12px -16px; position: relative;">
            <div style="position: absolute; left: -8px; top: -7px; width: 14px; height: 14px; background: var(--bg-primary); border-radius: 50%; border-right: 1px solid var(--border-color);"></div>
            <div style="position: absolute; right: -8px; top: -7px; width: 14px; height: 14px; background: var(--bg-primary); border-radius: 50%; border-left: 1px solid var(--border-color);"></div>
          </div>

          <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <!-- Barcode -->
            <div class="ticket-barcode-wrap" style="width: 80%; opacity: 0.85; margin: 4px 0;"></div>
            ${imgBtnHTML}
          </div>
        </div>
      `;

      // Event listener for Image View
      if (hasImage) {
        card.querySelector(".ticket-img-view-btn").addEventListener("click", () => {
          this.viewImage(ticket.imageUrl || ticket.imageBase64);
        });
      }

      // Event listener for Edit
      card.querySelector(".edit-tkt-btn").addEventListener("click", () => {
        this.openModalForEdit(ticket.id);
      });

      container.appendChild(card);
    });
  },

  viewImage(src) {
    const viewerModal = document.getElementById("ticket-image-viewer-modal");
    const viewerImg = document.getElementById("ticket-viewer-img");
    viewerImg.src = src;
    viewerModal.classList.add("active");
  },

  openModalForAdd() {
    const modal = document.getElementById("ticket-modal");
    document.getElementById("ticket-modal-title").innerText = "새 티켓 등록";
    document.getElementById("ticket-id").value = "";
    document.getElementById("ticket-category").value = "flight";
    document.getElementById("ticket-title").value = "";
    document.getElementById("ticket-date").value = "2026-10-15";
    document.getElementById("ticket-time").value = "10:00";
    document.getElementById("ticket-details").value = "";
    document.getElementById("ticket-image-file").value = "";
    document.getElementById("ticket-image-base64").value = "";
    document.getElementById("ticket-image-url").value = "";
    document.getElementById("ticket-memo").value = "";

    // Reset flight specific fields
    document.getElementById("ticket-dep-code").value = "";
    document.getElementById("ticket-arr-code").value = "";
    document.getElementById("ticket-flight-no").value = "";
    document.getElementById("flight-fields-group").style.display = "grid";

    document.getElementById("delete-ticket-btn").style.display = "none";
    modal.classList.add("active");
  },

  openModalForEdit(id) {
    const tickets = StorageManager.getTickets();
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    const modal = document.getElementById("ticket-modal");
    document.getElementById("ticket-modal-title").innerText = "티켓 정보 수정/삭제";
    document.getElementById("ticket-id").value = ticket.id;
    document.getElementById("ticket-category").value = ticket.category;
    document.getElementById("ticket-title").value = ticket.title;
    document.getElementById("ticket-date").value = ticket.date;
    document.getElementById("ticket-time").value = ticket.time;
    document.getElementById("ticket-details").value = ticket.details || "";
    document.getElementById("ticket-image-file").value = "";
    document.getElementById("ticket-image-base64").value = ticket.imageBase64 || "";
    document.getElementById("ticket-image-url").value = ticket.imageUrl || "";
    document.getElementById("ticket-memo").value = ticket.memo || "";

    // Load flight specific fields
    document.getElementById("ticket-dep-code").value = ticket.depCode || "";
    document.getElementById("ticket-arr-code").value = ticket.arrCode || "";
    document.getElementById("ticket-flight-no").value = ticket.flightNo || "";
    
    if (ticket.category === "flight") {
      document.getElementById("flight-fields-group").style.display = "grid";
    } else {
      document.getElementById("flight-fields-group").style.display = "none";
    }

    document.getElementById("delete-ticket-btn").style.display = "inline-flex";
    modal.classList.add("active");
  },

  closeModal() {
    document.getElementById("ticket-modal").classList.remove("active");
  },

  saveTicket() {
    const id = document.getElementById("ticket-id").value;
    const category = document.getElementById("ticket-category").value;
    const title = document.getElementById("ticket-title").value.trim();
    const date = document.getElementById("ticket-date").value;
    const time = document.getElementById("ticket-time").value;
    const details = document.getElementById("ticket-details").value.trim();
    const imageBase64 = document.getElementById("ticket-image-base64").value;
    const imageUrl = document.getElementById("ticket-image-url").value.trim();
    const memo = document.getElementById("ticket-memo").value.trim();

    // Flight specific fields
    const depCode = document.getElementById("ticket-dep-code").value.trim().toUpperCase();
    const arrCode = document.getElementById("ticket-arr-code").value.trim().toUpperCase();
    const flightNo = document.getElementById("ticket-flight-no").value.trim().toUpperCase();

    if (!title || !date || !time || !details) {
      alert("티켓 명칭, 날짜, 시간, 세부 정보를 모두 기입해 주세요.");
      return;
    }

    let tickets = StorageManager.getTickets();

    if (id) {
      // Edit
      tickets = tickets.map(t => {
        if (t.id === id) {
          return { ...t, category, title, date, time, details, imageBase64, imageUrl, memo, depCode, arrCode, flightNo };
        }
        return t;
      });
      App.showNotification("티켓 정보가 성공적으로 수정되었습니다.");
    } else {
      // Add
      const newTkt = {
        id: "tkt_" + Date.now(),
        category,
        title,
        date,
        time,
        details,
        imageBase64,
        imageUrl,
        memo,
        depCode,
        arrCode,
        flightNo
      };
      tickets.push(newTkt);
      App.showNotification("새 티켓이 성공적으로 등록되었습니다.");
    }

    StorageManager.saveTickets(tickets);
    this.render();
    this.closeModal();
  },

  deleteTicket() {
    const id = document.getElementById("ticket-id").value;
    if (!id) return;

    if (!confirm("정말 이 티켓 예매 정보를 삭제하시겠습니까?")) return;

    let tickets = StorageManager.getTickets();
    tickets = tickets.filter(t => t.id !== id);
    StorageManager.saveTickets(tickets);

    App.showNotification("티켓 정보가 삭제되었습니다.");
    this.render();
    this.closeModal();
  }
};
window.TicketsComponent = TicketsComponent;
