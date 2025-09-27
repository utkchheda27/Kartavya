// JS for Edit Button functionality
document.querySelectorAll(".bi-pencil-square").forEach((icon) => {
  icon.addEventListener("click", function (e) {
    let currentTask = e.target
      .closest(".task-individual")
      .querySelector(".task");
    let originalText = currentTask.textContent;
    let input = document.createElement("input");
    input.value = originalText.replace(/^\d+\.\s*/, ""); // Remove leading index
    input.className = "edit-input";
    currentTask.textContent = "";
    currentTask.appendChild(input);
    input.focus();

    input.addEventListener("blur", function () {
      if (input.value.trim() !== "") {
        currentTask.textContent =
          originalText.match(/^\d+\./) + " " + input.value;
      } else {
        currentTask.textContent = originalText;
      }
    });
  });
});
