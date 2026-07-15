// USA Travel Planner - Checklist Component
const ChecklistComponent = {
  init() {
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    const addForm = document.getElementById("checklist-add-form");
    
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const category = document.getElementById("checklist-add-category").value;
      const title = document.getElementById("checklist-add-title").value.trim();
      
      if (!title) return;

      const checklist = StorageManager.getChecklist();
      const newItem = {
        id: "chk_" + Date.now(),
        category,
        title,
        checked: false
      };

      checklist.push(newItem);
      StorageManager.saveChecklist(checklist);
      
      document.getElementById("checklist-add-title").value = "";
      App.showNotification("새로운 준비물이 추가되었습니다.");
      
      this.render();
    });
  },

  render() {
    const docContainer = document.getElementById("chk-list-document");
    const telContainer = document.getElementById("chk-list-telecom");
    const packContainer = document.getElementById("chk-list-packing");

    docContainer.innerHTML = "";
    telContainer.innerHTML = "";
    packContainer.innerHTML = "";

    const checklist = StorageManager.getChecklist();

    if (checklist.length === 0) {
      const emptyMsg = `<div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 13px;">등록된 체크리스트가 없습니다.</div>`;
      docContainer.innerHTML = emptyMsg;
      telContainer.innerHTML = emptyMsg;
      packContainer.innerHTML = emptyMsg;
      this.updateProgress(0, 0);
      return;
    }

    let checkedCount = 0;
    const totalCount = checklist.length;

    checklist.forEach(item => {
      if (item.checked) checkedCount++;

      const itemDiv = document.createElement("div");
      itemDiv.className = `checklist-item-row ${item.checked ? "checked" : ""}`;
      
      itemDiv.innerHTML = `
        <label class="checklist-label-wrap">
          <input type="checkbox" class="checklist-checkbox-real" ${item.checked ? "checked" : ""}>
          <span class="checklist-checkbox-custom"></span>
          <span class="checklist-item-title">${item.title}</span>
        </label>
        <button class="btn-icon delete-chk-btn" title="삭제" style="opacity: 0.5; font-size: 11px;">✕</button>
      `;

      // Checkbox Toggle Listener
      const checkbox = itemDiv.querySelector(".checklist-checkbox-real");
      checkbox.addEventListener("change", () => {
        this.toggleItem(item.id);
      });

      // Delete Listener
      itemDiv.querySelector(".delete-chk-btn").addEventListener("click", () => {
        this.deleteItem(item.id);
      });

      // Append to correct group container
      if (item.category === "document") {
        docContainer.appendChild(itemDiv);
      } else if (item.category === "telecom") {
        telContainer.appendChild(itemDiv);
      } else {
        packContainer.appendChild(itemDiv);
      }
    });

    // Handle empty groups nicely
    if (docContainer.children.length === 0) docContainer.innerHTML = `<div style="padding: 12px; font-size: 12px; color: var(--text-tertiary); text-align: center;">필수 서류/보험 항목이 비어있습니다.</div>`;
    if (telContainer.children.length === 0) telContainer.innerHTML = `<div style="padding: 12px; font-size: 12px; color: var(--text-tertiary); text-align: center;">금융/통신 항목이 비어있습니다.</div>`;
    if (packContainer.children.length === 0) packContainer.innerHTML = `<div style="padding: 12px; font-size: 12px; color: var(--text-tertiary); text-align: center;">개인 준비물 항목이 비어있습니다.</div>`;

    this.updateProgress(checkedCount, totalCount);
  },

  updateProgress(checked, total) {
    const progressFill = document.getElementById("checklist-progress-fill");
    const progressText = document.getElementById("checklist-progress-text");

    if (total === 0) {
      progressFill.style.width = "0%";
      progressText.innerText = "0% 완료 (0/0)";
      return;
    }

    const percentage = Math.round((checked / total) * 100);
    progressFill.style.width = `${percentage}%`;
    progressText.innerText = `${percentage}% 완료 (${checked}/${total})`;
  },

  toggleItem(id) {
    let checklist = StorageManager.getChecklist();
    checklist = checklist.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });

    StorageManager.saveChecklist(checklist);
    this.render();
  },

  deleteItem(id) {
    let checklist = StorageManager.getChecklist();
    checklist = checklist.filter(item => item.id !== id);
    StorageManager.saveChecklist(checklist);
    
    App.showNotification("준비물이 삭제되었습니다.");
    this.render();
  }
};
window.ChecklistComponent = ChecklistComponent;
