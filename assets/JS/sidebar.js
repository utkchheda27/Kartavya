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

document.querySelector(".profile-img").addEventListener("click", function (e) {
  document.getElementById("accountModal").style.display = "flex";
});
document
  .getElementById("closeAccountModal")
  .addEventListener("click", function () {
    document.getElementById("accountModal").style.display = "none";
  });
window.addEventListener("click", function (e) {
  if (e.target.id === "accountModal")
    document.getElementById("accountModal").style.display = "none";
});
