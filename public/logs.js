const API_URL = 'https://admin-dashboard-rbac-e79f.onrender.com/api/logs';
let currentPage = 1;
const limit = 10;

const token = localStorage.getItem("accessToken");
const user = JSON.parse(localStorage.getItem("user") || "{}");

// Auth check
if (!token || !user || !user.role) {
  alert("You must be logged in to view this page.");
  window.location.href = "login.html";
} else if (!["admin", "manager"].includes(user.role)) {
  alert("You are not authorized to view this page.");
  window.location.href = "dashboard.html";
}

async function loadLogs(filters = {}) {
  const params = new URLSearchParams({ page: currentPage, limit, ...filters });

  try {
    const res = await fetch(`${API_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    const tbody = document.querySelector("#logsTable tbody");
    tbody.innerHTML = "";

    if (data.logs && Array.isArray(data.logs)) {
      data.logs.forEach(log => {
        const row = `<tr>
          <td>${log._id}</td>
          <td>${log.user || ""}</td>
          <td>${log.action}</td>
          <td>${log.ip || ""}</td>
          <td>${new Date(log.createdAt).toLocaleString()}</td>
        </tr>`;
        tbody.insertAdjacentHTML("beforeend", row);
      });
    } else {
      tbody.innerHTML = "<tr><td colspan='5'>No logs found.</td></tr>";
    }
  } catch (err) {
    alert(`Error loading logs: ${err.message}`);
  }
}

// Handle filter form
document.getElementById("filterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  const formData = new FormData(e.target);
  const filters = Object.fromEntries(formData.entries());
  loadLogs(filters);
});

// Pagination
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    document.getElementById("pageNum").textContent = currentPage;
    loadLogs();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentPage++;
  document.getElementById("pageNum").textContent = currentPage;
  loadLogs();
});

// Export CSV
document.getElementById("exportCsv").addEventListener("click", () => {
  window.location = `${API_URL}/export?format=csv&token=${token}`;
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// Back to Dashboard
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Initial load
loadLogs();
