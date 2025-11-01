document.addEventListener("DOMContentLoaded", function () {
  const addTaskBtnLower = document.getElementById("addTaskBtnLower");
  const taskFormContainer = document.getElementById("taskFormContainer");
  const closeFormBtn = document.getElementById("closeFormBtn");

  addTaskBtnLower.addEventListener("click", () => {
    taskFormContainer.style.display = "block";
    addTaskBtnLower.style.display = "none"; // optionally hide the button when form is open
  });

  closeFormBtn.addEventListener("click", () => {
    taskFormContainer.style.display = "none";
    addTaskBtnLower.style.display = "flex"; // show button again
  });

  const darkModeToggle = document.getElementById("darkModeToggle");

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }

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

