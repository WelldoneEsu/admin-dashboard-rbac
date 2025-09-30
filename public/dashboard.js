    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "login.html"; // not logged in
    } else {
      document.getElementById("welcome").textContent = `Welcome, ${user.name} (${user.role})`;
    }

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      localStorage.clear();
      window.location.href = "login.html";
    });