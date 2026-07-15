// USA Travel Planner - Traveler Passports Component
const PassportsComponent = {
  init() {
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    const modal = document.getElementById("passport-modal");
    const closeBtn = document.getElementById("close-passport-modal-btn");
    const cancelBtn = document.getElementById("cancel-passport-modal-btn");
    const saveBtn = document.getElementById("save-passport-btn");

    closeBtn.addEventListener("click", () => this.closeModal());
    cancelBtn.addEventListener("click", () => this.closeModal());
    saveBtn.addEventListener("click", () => this.savePassport());

    // Profile photo upload handler (Convert to Base64)
    const fileInput = document.getElementById("passport-photo-file");
    const base64Input = document.getElementById("passport-photo-base64");
    
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 800 * 1024) {
          alert("파일 크기가 너무 큽니다 (800KB 이하의 이미지만 업로드 가능합니다).");
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
  },

  render() {
    const container = document.getElementById("passports-list-container");
    container.innerHTML = "";

    const passports = StorageManager.getPassports();

    passports.forEach(profile => {
      const card = document.createElement("div");
      card.className = "passport-card";
      
      // Default profile avatar silhouette if none uploaded
      const avatarHTML = profile.photoBase64 ? 
        `<img src="${profile.photoBase64}" class="passport-avatar" alt="${profile.nameKo} 프로필">` :
        `<div class="passport-avatar-placeholder">👤</div>`;

      // Apple iOS Passport Pass bio layout
      card.innerHTML = `
        <div class="passport-card-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span>🛂</span>
            <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">REPUBLIC OF KOREA</span>
          </div>
          <span class="passport-rel-tag">${profile.relationship}</span>
        </div>
        
        <div class="passport-card-body">
          <div style="display: flex; gap: 16px; align-items: center;">
            ${avatarHTML}
            <div style="flex-grow: 1; overflow: hidden;">
              <span style="font-size: 10px; color: var(--text-secondary); font-weight: 600; display: block; line-height: 1;">NAME</span>
              <span style="font-size: 16px; font-weight: 800; color: var(--text-primary); display: block; margin-top: 2px;">${profile.nameEn}</span>
              <span style="font-size: 12px; font-weight: 500; color: var(--text-secondary); display: block; margin-top: 1px;">${profile.nameKo}</span>
            </div>
          </div>
          
          <div class="passport-details-grid" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 10px; margin-top: 14px; border-top: 1px dashed var(--border-color); padding-top: 10px;">
            <div>
              <span style="font-size: 9px; color: var(--text-secondary); font-weight: 600; display: block;">PASSPORT NO.</span>
              <div style="display: flex; align-items: center; gap: 4px; margin-top: 1px;">
                <span class="passport-num-text" style="font-size: 14px; font-weight: 700; font-family: monospace; letter-spacing: 0.5px;">${profile.passportNo}</span>
                <button class="btn btn-sm copy-passport-btn" style="padding: 2px 5px; font-size: 10px; background: rgba(0,122,255,0.08); color: #007aff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">복사</button>
              </div>
            </div>
            <div>
              <span style="font-size: 9px; color: var(--text-secondary); font-weight: 600; display: block;">DATE OF BIRTH</span>
              <span style="font-size: 12px; font-weight: 700; display: block; margin-top: 1px;">${profile.birthdate.replace(/-/g, "/")}</span>
            </div>
            <div>
              <span style="font-size: 9px; color: var(--text-secondary); font-weight: 600; display: block;">DATE OF EXPIRY</span>
              <span style="font-size: 12px; font-weight: 700; display: block; margin-top: 1px; color: ${this.isExpiredSoon(profile.expiryDate) ? '#ff3b30' : 'inherit'};">
                ${profile.expiryDate.replace(/-/g, "/")}
              </span>
            </div>
            <div>
              <span style="font-size: 9px; color: var(--text-secondary); font-weight: 600; display: block;">DATE OF ISSUE</span>
              <span style="font-size: 12px; font-weight: 700; display: block; margin-top: 1px;">${profile.issueDate.replace(/-/g, "/")}</span>
            </div>
          </div>
          
          ${profile.memo ? `
            <div style="margin-top: 10px; padding: 6px 10px; background: rgba(0,0,0,0.02); border-radius: 6px; font-size: 11px; color: var(--text-secondary);">
              📝 ${profile.memo}
            </div>
          ` : ""}
          
          <div style="display: flex; justify-content: flex-end; margin-top: 14px; border-top: 1px solid var(--border-color); padding-top: 8px;">
            <button class="btn btn-secondary btn-sm edit-passport-btn" style="font-size: 11px; padding: 4px 10px; border-radius: 6px;">✏️ 수정</button>
          </div>
        </div>
      `;

      // Copy Passport Number Handler
      card.querySelector(".copy-passport-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(profile.passportNo).then(() => {
          App.showNotification(`${profile.nameKo}님의 여권번호가 복사되었습니다.`);
        });
      });

      // Edit Handler
      card.querySelector(".edit-passport-btn").addEventListener("click", () => {
        this.openModalForEdit(profile.id);
      });

      container.appendChild(card);
    });
  },

  isExpiredSoon(dateStr) {
    const expiry = new Date(dateStr);
    const today = new Date();
    const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in ms
    return (expiry.getTime() - today.getTime()) < sixMonths;
  },

  openModalForEdit(id) {
    const passports = StorageManager.getPassports();
    const profile = passports.find(p => p.id === id);
    if (!profile) return;

    const modal = document.getElementById("passport-modal");
    document.getElementById("passport-id").value = profile.id;
    document.getElementById("passport-relationship").value = profile.relationship;
    document.getElementById("passport-name-ko").value = profile.nameKo;
    document.getElementById("passport-name-en").value = profile.nameEn;
    document.getElementById("passport-number").value = profile.passportNo;
    document.getElementById("passport-birthdate").value = profile.birthdate;
    document.getElementById("passport-issue-date").value = profile.issueDate;
    document.getElementById("passport-expiry-date").value = profile.expiryDate;
    document.getElementById("passport-photo-file").value = "";
    document.getElementById("passport-photo-base64").value = profile.photoBase64 || "";
    document.getElementById("passport-memo").value = profile.memo || "";

    modal.classList.add("active");
  },

  closeModal() {
    document.getElementById("passport-modal").classList.remove("active");
  },

  savePassport() {
    const id = document.getElementById("passport-id").value;
    const relationship = document.getElementById("passport-relationship").value.trim();
    const nameKo = document.getElementById("passport-name-ko").value.trim();
    const nameEn = document.getElementById("passport-name-en").value.trim().toUpperCase();
    const passportNo = document.getElementById("passport-number").value.trim().toUpperCase();
    const birthdate = document.getElementById("passport-birthdate").value;
    const issueDate = document.getElementById("passport-issue-date").value;
    const expiryDate = document.getElementById("passport-expiry-date").value;
    const photoBase64 = document.getElementById("passport-photo-base64").value;
    const memo = document.getElementById("passport-memo").value.trim();

    if (!relationship || !nameKo || !nameEn || !passportNo || !birthdate || !issueDate || !expiryDate) {
      alert("모든 필수 정보(관계, 이름, 여권번호, 생년월일, 발급일, 만료일)를 기입해 주세요.");
      return;
    }

    let passports = StorageManager.getPassports();
    passports = passports.map(p => {
      if (p.id === id) {
        return { ...p, relationship, nameKo, nameEn, passportNo, birthdate, issueDate, expiryDate, photoBase64, memo };
      }
      return p;
    });

    StorageManager.savePassports(passports);
    App.showNotification(`${nameKo}님의 정보가 성공적으로 수정되었습니다.`);
    this.render();
    this.closeModal();
  }
};
window.PassportsComponent = PassportsComponent;
