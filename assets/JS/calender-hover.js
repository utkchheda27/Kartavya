document.querySelectorAll(".calendarIcon").forEach((icon, index) => {
  const input = document.querySelectorAll(".calendarInput")[index];

  const calendar = flatpickr(input, {
    altInput: true,
    altFormat: "j M Y",
    dateFormat: "Y-m-d",
    defaultDate: "today",
    minDate: "today",
    clickOpens: false,
    onClose: () => {
      input.style.display = "none"; // hide after selecting
    }
  });

  icon.addEventListener("click", () => {
    input.style.display = "block"; // show when clicked
    calendar.open();
  });
});
