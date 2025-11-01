document.getElementById("profile-pic").addEventListener("change", function (e) {
  const label = document.querySelector(".custom-file-upload");
  const selectedSpan = document.querySelector(".file-selected");

  if (this.files && this.files[0]) {
    selectedSpan.textContent = this.files[0].name;
    label.classList.add("has-file");
  } else {
    selectedSpan.textContent = "";
    label.classList.remove("has-file");
  }
});
