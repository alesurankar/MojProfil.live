document.getElementById("content").addEventListener("click", (e) => {
  if (e.target.classList.contains("skill-btn")) {
    const details = e.target.nextElementSibling;
    details.classList.toggle("active");
  }
});