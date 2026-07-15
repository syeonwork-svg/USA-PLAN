// USA Travel Planner - Expenses Component
const ExpensesComponent = {
  categories: {
    accommodation: { label: "숙박", color: "#8e8e93", emoji: "🏨" },
    transport: { label: "교통", color: "#007aff", emoji: "✈️" },
    food: { label: "식비", color: "#ff9500", emoji: "🍔" },
    activity: { label: "액티비티", color: "#34c759", emoji: "⛳️" },
    shopping: { label: "쇼핑", color: "#ff2d55", emoji: "🛍️" },
    etc: { label: "기타", color: "#ff3b30", emoji: "💸" }
  },

  init() {
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    const modal = document.getElementById("expense-modal");
    const closeBtn = document.getElementById("close-expense-modal-btn");
    const cancelBtn = document.getElementById("cancel-expense-modal-btn");
    const saveBtn = document.getElementById("save-expense-btn");
    const deleteBtn = document.getElementById("delete-expense-btn");

    closeBtn.addEventListener("click", () => this.closeModal());
    cancelBtn.addEventListener("click", () => this.closeModal());
    saveBtn.addEventListener("click", () => this.saveExpense());
    deleteBtn.addEventListener("click", () => this.deleteExpense());

    document.getElementById("add-expense-btn").addEventListener("click", () => {
      this.openModalForAdd();
    });

    // Make the budget card interactive
    document.querySelector(".summary-card.budget").addEventListener("click", () => {
      this.promptChangeBudget();
    });

    // Clear all expenses
    const clearAllBtn = document.getElementById("clear-all-expenses-btn");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        if (confirm("모든 경비 상세 내역을 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)")) {
          StorageManager.saveExpenses([]);
          App.showNotification("모든 경비 내역이 삭제되었습니다.");
          this.render();
        }
      });
    }
  },

  promptChangeBudget() {
    const details = StorageManager.getTripDetails();
    const newBudgetStr = prompt("총 예산을 수정해주세요 (숫자만 입력):", details.budget);
    if (newBudgetStr === null) return;
    
    const newBudget = parseInt(newBudgetStr);
    if (isNaN(newBudget) || newBudget < 0) {
      alert("올바른 예산 금액을 입력해주세요.");
      return;
    }

    details.budget = newBudget;
    StorageManager.saveTripDetails(details);
    App.showNotification("총 예산이 성공적으로 수정되었습니다.");
    this.render();
  },

  render() {
    const details = StorageManager.getTripDetails();
    const expenses = StorageManager.getExpenses();

    // 1. Calculate stats
    const totalBudget = details.budget;
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const remaining = totalBudget - totalSpent;

    // 2. Render summary cards
    document.getElementById("summary-budget").innerText = `₩${this.formatCurrency(totalBudget)}`;
    document.getElementById("summary-spent").innerText = `₩${this.formatCurrency(totalSpent)}`;
    
    const remainingEl = document.getElementById("summary-remaining");
    remainingEl.innerText = `₩${this.formatCurrency(remaining)}`;
    if (remaining < 0) {
      remainingEl.style.color = "var(--color-red)";
    } else {
      remainingEl.style.color = "var(--color-green)";
    }

    // 3. Render chart & legend
    this.renderChart(expenses, totalSpent);

    // 4. Render transaction log
    this.renderLog(expenses);
  },

  renderChart(expenses, totalSpent) {
    const chartSvg = document.getElementById("donut-chart-svg");
    const legendContainer = document.getElementById("chart-legend");
    const totalText = document.getElementById("chart-total-text");
    
    chartSvg.innerHTML = "";
    legendContainer.innerHTML = "";
    totalText.innerText = `₩${this.formatCurrency(totalSpent)}`;

    if (totalSpent === 0) {
      // Draw empty placeholder circle
      chartSvg.innerHTML = `
        <circle cx="110" cy="110" r="70" fill="none" stroke="var(--border-color)" stroke-width="14" />
      `;
      legendContainer.innerHTML = `<div style="grid-column: span 2; text-align: center; color: var(--text-secondary); font-size: 12px;">등록된 경비가 없습니다.</div>`;
      return;
    }

    // Group expenses by category
    const categoryTotals = {};
    Object.keys(this.categories).forEach(cat => {
      categoryTotals[cat] = 0;
    });

    expenses.forEach(item => {
      if (categoryTotals[item.category] !== undefined) {
        categoryTotals[item.category] += item.amount;
      } else {
        categoryTotals["etc"] += item.amount;
      }
    });

    // Donut math
    const radius = 70;
    const circumference = 2 * Math.PI * radius; // ~439.82
    let currentOffset = 0;

    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt === 0) return;

      const percentage = (amt / totalSpent) * 100;
      const strokeLength = (percentage / 100) * circumference;
      const strokeOffset = currentOffset;
      
      const catInfo = this.categories[cat];

      // Create SVG circle segment
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "110");
      circle.setAttribute("cy", "110");
      circle.setAttribute("r", radius.toString());
      circle.setAttribute("class", "donut-segment");
      circle.setAttribute("stroke", catInfo.color);
      circle.setAttribute("stroke-dasharray", `${strokeLength} ${circumference - strokeLength}`);
      circle.setAttribute("stroke-dashoffset", (-strokeOffset).toString());
      
      circle.addEventListener("mouseenter", () => {
        totalText.innerText = `₩${this.formatCurrency(amt)}`;
        totalText.previousElementSibling.innerText = catInfo.label;
      });

      circle.addEventListener("mouseleave", () => {
        totalText.innerText = `₩${this.formatCurrency(totalSpent)}`;
        totalText.previousElementSibling.innerText = "총 지출";
      });

      chartSvg.appendChild(circle);

      // Create Legend Item
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";
      legendItem.innerHTML = `
        <span class="legend-color" style="background-color: ${catInfo.color}"></span>
        <span>${catInfo.label} (${percentage.toFixed(1)}%)</span>
      `;
      legendContainer.appendChild(legendItem);

      currentOffset += strokeLength;
    });
  },

  renderLog(expenses) {
    const listContainer = document.getElementById("expense-list");
    listContainer.innerHTML = "";

    // Sort expenses by date descending
    const sortedExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

    if (sortedExpenses.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
          <span style="font-size: 32px;">💸</span>
          <p style="margin-top: 10px; font-size: 14px;">지출 내역이 비어 있습니다.</p>
        </div>
      `;
      return;
    }

    sortedExpenses.forEach(exp => {
      const catInfo = this.categories[exp.category] || this.categories.etc;
      
      const item = document.createElement("div");
      item.className = "expense-item";
      item.innerHTML = `
        <div class="expense-item-info">
          <div class="expense-cat-icon ${exp.category}">
            ${catInfo.emoji}
          </div>
          <div class="expense-item-details">
            <span class="expense-item-title">${exp.title}</span>
            <span class="expense-item-meta">${exp.date} ${exp.memo ? `| ${exp.memo}` : ""}</span>
          </div>
        </div>
        <div class="expense-item-value" style="display: flex; align-items: center; gap: 8px;">
          <span class="expense-item-amount" style="font-weight: 700; color: var(--text-primary);">₩${this.formatCurrency(exp.amount)}</span>
          <div style="display: flex; gap: 4px;">
            <button class="btn-icon edit-exp-btn" title="수정" style="padding: 4px;">✏️</button>
            <button class="btn-icon delete-exp-btn-quick" title="삭제" style="padding: 4px; color: #ff3b30; background: transparent; border: none; cursor: pointer;">🗑️</button>
          </div>
        </div>
      `;

      item.querySelector(".edit-exp-btn").addEventListener("click", () => {
        this.openModalForEdit(exp.id);
      });

      item.querySelector(".delete-exp-btn-quick").addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`'${exp.title}' 경비 항목을 삭제하시겠습니까?`)) {
          this.deleteExpenseById(exp.id);
        }
      });

      listContainer.appendChild(item);
    });
  },

  deleteExpenseById(id) {
    let expenses = StorageManager.getExpenses();
    expenses = expenses.filter(item => item.id !== id);
    StorageManager.saveExpenses(expenses);
    App.showNotification("경비 항목이 삭제되었습니다.");
    this.render();
  },

  openModalForAdd() {
    const modal = document.getElementById("expense-modal");
    document.getElementById("expense-modal-title").innerText = "경비 추가";
    document.getElementById("expense-id").value = "";
    document.getElementById("expense-category").value = "food";
    document.getElementById("expense-title").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-date").value = "2026-10-15";
    document.getElementById("expense-memo").value = "";

    document.getElementById("delete-expense-btn").style.display = "none";
    modal.classList.add("active");
  },

  openModalForEdit(id) {
    const expenses = StorageManager.getExpenses();
    const exp = expenses.find(item => item.id === id);
    if (!exp) return;

    const modal = document.getElementById("expense-modal");
    document.getElementById("expense-modal-title").innerText = "경비 수정/삭제";
    document.getElementById("expense-id").value = exp.id;
    document.getElementById("expense-category").value = exp.category;
    document.getElementById("expense-title").value = exp.title;
    document.getElementById("expense-amount").value = exp.amount;
    document.getElementById("expense-date").value = exp.date;
    document.getElementById("expense-memo").value = exp.memo || "";

    document.getElementById("delete-expense-btn").style.display = "inline-flex";
    modal.classList.add("active");
  },

  closeModal() {
    document.getElementById("expense-modal").classList.remove("active");
  },

  saveExpense() {
    const id = document.getElementById("expense-id").value;
    const category = document.getElementById("expense-category").value;
    const title = document.getElementById("expense-title").value.trim();
    const amountVal = document.getElementById("expense-amount").value;
    const date = document.getElementById("expense-date").value;
    const memo = document.getElementById("expense-memo").value.trim();

    if (!title || !amountVal || !date) {
      alert("지출 항목, 금액, 날짜를 입력해주세요.");
      return;
    }

    const amount = parseInt(amountVal);
    if (isNaN(amount) || amount <= 0) {
      alert("올바른 금액을 입력해주세요.");
      return;
    }

    let expenses = StorageManager.getExpenses();

    if (id) {
      // Edit
      expenses = expenses.map(item => {
        if (item.id === id) {
          return { ...item, category, title, amount, date, memo };
        }
        return item;
      });
      App.showNotification("경비 내역이 수정되었습니다.");
    } else {
      // Add
      const newExp = {
        id: "exp_" + Date.now(),
        category,
        title,
        amount,
        date,
        memo
      };
      expenses.push(newExp);
      App.showNotification("경비 내역이 추가되었습니다.");
    }

    StorageManager.saveExpenses(expenses);
    this.render();
    this.closeModal();
  },

  deleteExpense() {
    const id = document.getElementById("expense-id").value;
    if (!id) return;

    if (!confirm("정말 이 경비 내역을 삭제하시겠습니까?")) return;

    let expenses = StorageManager.getExpenses();
    expenses = expenses.filter(item => item.id !== id);
    StorageManager.saveExpenses(expenses);

    App.showNotification("경비 내역이 삭제되었습니다.");
    this.render();
    this.closeModal();
  },

  formatCurrency(value) {
    return value.toLocaleString("ko-KR");
  }
};
window.ExpensesComponent = ExpensesComponent;
