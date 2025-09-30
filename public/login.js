const API ='https://admin-dashboard-rbac-e79f.onrender.com';

document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const data = {
        email: form.email.value,
        password: form.password.value,
      };

      try {
        const res = await fetch(`${API}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        if (res.ok) {
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
          localStorage.setItem("user", JSON.stringify(result.user));
          window.location.href = "dashboard.html";
        } else {
          document.getElementById("msg").textContent = result.message;
        }
      } catch (err) {
        document.getElementById("msg").textContent = "Error logging in.";
      }
    });