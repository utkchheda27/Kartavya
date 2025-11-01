document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const addTaskmodal = document.getElementById("taskModal");
  const moreModal = document.getElementById("moreModal");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const moreBtn = document.getElementById("moreBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // Open modal on "Add Task" click
  addTaskBtn.addEventListener("click", () => {
    addTaskmodal.style.display = "block";
  });

  moreBtn.addEventListener("click", function (e) {
    e.preventDefault(); // prevent redirect
    moreModal.style.display = "block";
  });

  // Close modal on "×" click
  closeModalBtn.addEventListener("click", () => {
    addTaskmodal.style.display = "none";
  });

  // Close modal on outside click
  window.addEventListener("click", (event) => {
    if (event.target === addTaskmodal || event.target === moreModal) {
      const modal = event.target;
      modal.style.display = "none";
    }
  });

  //DropDown on clking profilePic
  const profilePic = document.getElementById("profile-pic");
  const profileDropdown = document.getElementById("profile-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  profilePic.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent event bubbling that closes dropdown immediately
    profileDropdown.style.display =
      profileDropdown.style.display === "block" ? "none" : "block";
  });

  logoutBtn.addEventListener("click", async function () {
    try {
      await axios.post("/logout");
      window.location.href = "/login"; // Redirect after successful logout
    } catch (error) {
      alert(
        "Logout failed: " + (error.response?.data?.message || error.message)
      );
    }
  });

  // Clicking outside closes dropdown
  document.addEventListener("click", function () {
    profileDropdown.style.display = "none";
  });

  const darkModeToggle = document.getElementById("darkModeToggle");

  // Load saved preference from localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }

  // Toggle dark mode and save preference
  darkModeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });
});
