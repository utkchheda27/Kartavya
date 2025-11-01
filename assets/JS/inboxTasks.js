document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("tasks-list");

  // Create Sortable instance
  Sortable.create(el, {
    animation: 250,
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    swapThreshold: 0.65,
    onStart: function (evt) {
      evt.item.classList.add("dragging");
    },
    onEnd: async function (evt) {
      evt.item.classList.remove("dragging");
      // Collect ordered task IDs after drag
      const ids = Array.from(el.children).map((div) => div.dataset.id);
      try {
        // Send the updated order to the server
        await axios.post("/tasks/reorder", { ids });
      } catch (error) {
        console.error("Failed to update order", error);
      }
    },
  });


  // Your existing JS for edit, complete, etc.

  document.querySelectorAll(".bi-pencil-square").forEach((icon) => {
    icon.addEventListener("click", function () {
      let currentTask = this.closest(".task-individual").querySelector(".task");
      let originalText = currentTask.textContent;
      let input = document.createElement("input");
      input.value = originalText.replace(/\d+\. /, ""); // Remove numbered index if needed
      input.className = "edit-input";
      currentTask.textContent = "";
      currentTask.appendChild(input);
      input.focus();

      input.addEventListener("blur", function () {
        if (input.value.trim()) {
          currentTask.textContent = input.value;
          // TODO: Update backend with edited text
        } else {
          currentTask.textContent = originalText;
        }
      });
    });
  });

  document.querySelectorAll(".circle-checkbox").forEach((button) => {
    button.addEventListener("click", async () => {
      const taskId = button.getAttribute("data-task-id");
      const taskDiv = button.closest(".task-individual");
      try {
        await axios.patch(`/tasks/${taskId}/complete`);
        button.classList.add("completed");
        button.querySelector("i").classList.add("bi-check-lg");
        taskDiv.style.transition = "opacity 0.4s, transform 0.4s";
        taskDiv.style.opacity = 0;
        taskDiv.style.transform = "translateY(-24px)";
        setTimeout(() => {
          taskDiv.remove();
        }, 400);
      } catch (err) {
        console.error("Failed to mark task as completed", err);
      }
    });
  });
});

