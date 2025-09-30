const API_URL = 'http://localhost:5000/api/stats';
const token = localStorage.getItem("accessToken");
const user = JSON.parse(localStorage.getItem("user") || "{}");

// 🔒 Check if user is logged in and has correct role
if (!token || !user?.role) {
  alert("You must be logged in to view this page.");
  window.location.href = "login.html";
} else if (!["admin", "manager"].includes(user.role)) {
  alert("You are not authorized to view this page.");
  window.location.href = "dashboard.html";
}

// 📡 Reusable fetch function with error handling
async function fetchData(endpoint) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Unknown error");
    }

    return await res.json();
  } catch (err) {
    alert(`Error loading ${endpoint}: ${err.message}`);
    return []; // So that .forEach doesn't break
  }
}

// 👥 Load Users by Role
async function loadUsersByRole() {
  const data = await fetchData("users");
  const tbody = document.querySelector("#usersByRoleTable tbody");
  tbody.innerHTML = "";
  data.forEach(row => {
    const tr = `<tr><td>${row.role}</td><td>${row.count}</td></tr>`;
    tbody.insertAdjacentHTML("beforeend", tr);
  });
}

// 🔐 Load Login Attempts
async function loadLoginAttempts() {
  const data = await fetchData("logins");
  const tbody = document.querySelector("#loginAttemptsTable tbody");
  tbody.innerHTML = "";
  data.forEach(row => {
    const tr = `<tr><td>${row.action}</td><td>${row.count}</td></tr>`;
    tbody.insertAdjacentHTML("beforeend", tr);
  });
}

// 🟢 Load Active Users (last 24h)
async function loadActiveUsers() {
  const data = await fetchData("active-users");
  document.getElementById("activeUsers").textContent = data.activeUsers || 0;
}

// 🚀 Load all stats on page load
loadUsersByRole();
loadLoginAttempts();
loadActiveUsers();

// 🔒 Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// ⬅ Back to Dashboard button
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
