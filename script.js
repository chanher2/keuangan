const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const balanceDisplay = document.getElementById("balance");
const filterDate = document.getElementById("filter-date");
const resetBtn = document.getElementById("reset-btn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

renderTransactions();
updateBalance();
updateChart();
renderHistory();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;

  transactions.push({ description, amount, date });
  localStorage.setItem("transactions", JSON.stringify(transactions));

  form.reset();
  renderTransactions();
  updateBalance();
  updateChart();
  renderHistory();
});

filterDate.addEventListener("change", () => {
  renderTransactions();
  updateChart();
  renderHistory();
});

resetBtn.addEventListener("click", () => {
  if (confirm("Apakah Anda yakin ingin menghapus semua data keuangan?")) {
    transactions = [];
    localStorage.removeItem("transactions");
    renderTransactions();
    updateBalance();
    updateChart();
    renderHistory();
  }
});

function renderTransactions() {
  transactionList.innerHTML = "";
  const selectedDate = filterDate.value;

  transactions
    .filter(tx => !selectedDate || tx.date === selectedDate)
    .forEach((tx) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${tx.description} (${tx.date})</span>
        <strong>${tx.amount >= 0 ? "+" : ""}Rp${tx.amount.toLocaleString("id-ID")}</strong>
      `;
      transactionList.appendChild(li);
    });

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateBalance() {
  const total = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  balanceDisplay.textContent = "Rp" + total.toLocaleString("id-ID");
}

function updateChart() {
  const income = transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0);

  const ctx = document.getElementById("summaryChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Pemasukan", "Pengeluaran"],
      datasets: [{
        data: [income, Math.abs(expense)],
        backgroundColor: ["#2d6a4f", "#d90429"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

function renderHistory() {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).reverse();

  sorted.forEach((tx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${tx.date} - ${tx.description}</span>
      <strong>${tx.amount >= 0 ? "+" : ""}Rp${tx.amount.toLocaleString("id-ID")}</strong>
    `;
    historyList.appendChild(li);
  });
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBreMmnGi0dRjFfykXm97P-IAlb2NTmtFM",
  authDomain: "keuangan-47406.firebaseapp.com",
  projectId: "keuangan-47406",
  storageBucket: "keuangan-47406.firebasestorage.app",
  messagingSenderId: "499283027279",
  appId: "1:499283027279:web:d192fb11f79c7eeb7a913a",
  measurementId: "G-TXLW2HLGDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);