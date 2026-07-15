// USA Travel Planner - Candidates Component
const CandidatesComponent = {
  currentCategory: "all",

  init() {
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    // Add Candidate Button
    const addBtn = document.getElementById("add-candidate-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => this.openModalForAdd());
    }

    // Modal Close buttons
    const closeBtn = document.getElementById("close-candidate-modal-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }
    const cancelBtn = document.getElementById("cancel-candidate-modal-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.closeModal());
    }

    // Save Button
    const saveBtn = document.getElementById("save-candidate-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => this.saveCandidate());
    }

    // Filters
    const filterContainer = document.getElementById("candidate-filters");
    if (filterContainer) {
      const filterBtns = filterContainer.querySelectorAll(".filter-btn");
      filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
          filterBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.currentCategory = btn.dataset.cat;
          this.render();
        });
      });
    }
  },

  openModalForAdd() {
    const modal = document.getElementById("candidate-modal");
    document.getElementById("candidate-modal-title").innerText = "결제 후보 등록";
    document.getElementById("candidate-id").value = "";
    document.getElementById("candidate-title").value = "";
    document.getElementById("candidate-category").value = "flight";
    document.getElementById("candidate-url").value = "";
    document.getElementById("candidate-price").value = "";
    document.getElementById("candidate-memo").value = "";
    modal.classList.add("active");
  },

  openModalForEdit(id) {
    const candidates = StorageManager.getCandidates();
    const item = candidates.find(c => c.id === id);
    if (!item) return;

    const modal = document.getElementById("candidate-modal");
    document.getElementById("candidate-modal-title").innerText = "결제 후보 수정";
    document.getElementById("candidate-id").value = item.id;
    document.getElementById("candidate-title").value = item.title;
    document.getElementById("candidate-category").value = item.category;
    document.getElementById("candidate-url").value = item.url;
    document.getElementById("candidate-price").value = item.price || "";
    document.getElementById("candidate-memo").value = item.memo || "";
    modal.classList.add("active");
  },

  closeModal() {
    document.getElementById("candidate-modal").classList.remove("active");
  },

  saveCandidate() {
    const id = document.getElementById("candidate-id").value;
    const title = document.getElementById("candidate-title").value.trim();
    const category = document.getElementById("candidate-category").value;
    const url = document.getElementById("candidate-url").value.trim();
    const price = document.getElementById("candidate-price").value.trim();
    const memo = document.getElementById("candidate-memo").value.trim();

    if (!title) {
      alert("후보 이름/상품명을 입력해 주세요.");
      return;
    }
    if (!url) {
      alert("링크 주소를 입력해 주세요.");
      return;
    }

    // Simple URL check
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("올바른 주소 형식(http:// 또는 https:// 포함)으로 입력해 주세요.");
      return;
    }

    const candidates = StorageManager.getCandidates();

    if (id) {
      // Edit mode
      const index = candidates.findIndex(c => c.id === id);
      if (index !== -1) {
        candidates[index] = { ...candidates[index], title, category, url, price, memo };
      }
    } else {
      // Add mode
      const newItem = {
        id: "cand_" + Date.now(),
        title,
        category,
        url,
        price,
        memo
      };
      candidates.push(newItem);
    }

    StorageManager.saveCandidates(candidates);
    this.closeModal();
    this.render();
    
    if (window.App && typeof App.showNotification === "function") {
      App.showNotification(id ? "결제 후보가 수정되었습니다." : "새 결제 후보가 추가되었습니다.");
    }
  },

  deleteCandidate(id) {
    if (confirm("정말 이 결제 후보를 삭제하시겠습니까?")) {
      let candidates = StorageManager.getCandidates();
      candidates = candidates.filter(c => c.id !== id);
      StorageManager.saveCandidates(candidates);
      this.render();
      if (window.App && typeof App.showNotification === "function") {
        App.showNotification("결제 후보가 삭제되었습니다.");
      }
    }
  },

  getDomain(url) {
    try {
      const u = new URL(url);
      return u.hostname.replace("www.", "");
    } catch (e) {
      return "link";
    }
  },

  getBrandInfo(url) {
    const lower = url.toLowerCase();
    if (lower.includes("klook")) return { name: "Klook", color: "#FF5B00", logo: "🧡" };
    if (lower.includes("booking.com")) return { name: "Booking.com", color: "#003580", logo: "💙" };
    if (lower.includes("myrealtrip")) return { name: "마이리얼트립", color: "#2B87F0", logo: "✈️" };
    if (lower.includes("naver")) return { name: "네이버", color: "#03C75A", logo: "💚" };
    if (lower.includes("delta")) return { name: "Delta Air Lines", color: "#E01933", logo: "🔺" };
    if (lower.includes("expedia")) return { name: "Expedia", color: "#00355F", logo: "🟡" };
    if (lower.includes("airbnb")) return { name: "Airbnb", color: "#FF5A5F", logo: "🏡" };
    return null;
  },

  render() {
    const container = document.getElementById("candidates-list-container");
    if (!container) return;

    container.innerHTML = "";
    const candidates = StorageManager.getCandidates();

    const filtered = candidates.filter(item => {
      if (this.currentCategory === "all") return true;
      return item.category === this.currentCategory;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; background: var(--bg-secondary); border: 1px dashed var(--border-color); border-radius: 12px; color: var(--text-secondary);">
          <div style="font-size: 28px; margin-bottom: 12px;">🛒</div>
          <p style="font-size: 14px; font-weight: 600;">등록된 결제 후보가 없습니다.</p>
          <p style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">상단의 '+ 후보 등록' 버튼을 눌러 비교할 예약 링크들을 추가해 보세요!</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "candidate-card";

      // Category formatting
      let catText = "기타";
      let catIcon = "🎫";
      let gradStart = "#8e8e93";
      let gradEnd = "#636366";

      if (item.category === "flight") {
        catText = "항공";
        catIcon = "✈️";
        gradStart = "#ff2d55";
        gradEnd = "#ff3b30";
      } else if (item.category === "museum") {
        catText = "미술관/문화";
        catIcon = "🏛️";
        gradStart = "#007aff";
        gradEnd = "#5856d6";
      } else if (item.category === "activity") {
        catText = "액티비티";
        catIcon = "🧗";
        gradStart = "#34c759";
        gradEnd = "#4cd964";
      }

      const domain = this.getDomain(item.url);
      const brand = this.getBrandInfo(item.url);
      const brandBadge = brand 
        ? `<span class="candidate-domain-badge" style="color: white; background-color: ${brand.color}; border-color: ${brand.color};">${brand.logo} ${brand.name}</span>`
        : `<span class="candidate-domain-badge">🔗 ${domain}</span>`;

      // Visual Background preview simulation
      const previewHtml = `
        <div class="candidate-preview-box" style="background: linear-gradient(135deg, ${gradStart}33, ${gradEnd}11);">
          <div class="candidate-preview-icon" style="color: ${gradStart};">${catIcon}</div>
          <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; display: flex; justify-content: space-between; align-items: center; z-index: 2;">
            ${brandBadge}
            ${item.price ? `<span style="font-size: 11px; font-weight: 700; color: ${gradStart}; background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-color);">${item.price}</span>` : ""}
          </div>
        </div>
      `;

      card.innerHTML = `
        <div class="candidate-card-header">
          <span class="candidate-cat-badge ${item.category}">${catIcon} ${catText}</span>
          <span style="font-size: 11px; color: var(--text-tertiary);">비교 카드</span>
        </div>
        <div class="candidate-card-body">
          ${previewHtml}
          <div class="candidate-title-text">${item.title}</div>
          ${item.memo ? `<div class="candidate-memo-text">${item.memo}</div>` : `<div class="candidate-memo-text" style="color: var(--text-tertiary); font-style: italic;">추가 메모가 없습니다.</div>`}
          <div class="candidate-link-row">
            <span>바로가기</span>
            <span>➔</span>
          </div>
        </div>
        <div class="candidate-card-actions">
          <button class="candidate-action-btn edit-cand-btn" title="수정">✏️</button>
          <button class="candidate-action-btn delete-cand-btn delete" title="삭제">✕</button>
        </div>
      `;

      // Card link redirect
      card.addEventListener("click", () => {
        window.open(item.url, "_blank");
      });

      // Actions propagation stop
      const editBtn = card.querySelector(".edit-cand-btn");
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openModalForEdit(item.id);
      });

      const deleteBtn = card.querySelector(".delete-cand-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteCandidate(item.id);
      });

      container.appendChild(card);
    });
  }
};

window.CandidatesComponent = CandidatesComponent;
