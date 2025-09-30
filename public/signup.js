const API = 'https://admin-dashboard-rbac-e79f.onrender.com';

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value,
    role: form.role.value
  };

  try {
    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      // ✅ redirect after signup
      window.location.href = "login.html"; 
    } else {
      document.getElementById("msg").textContent = result.message || "Signup failed.";
    }
  } catch (err) {
    document.getElementById("msg").textContent = "Error signing up.";
  }
});
