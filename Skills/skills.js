document.getElementById("content").addEventListener("click", (e) => {
  if (e.target.classList.contains("skill-btn")) {
    const details = e.target.nextElementSibling;
    details.classList.toggle("active");

    if (details.classList.contains("active")) {
      details.style.maxHeight = details.scrollHeight + "px";
    } else {
      details.style.maxHeight = "0";
    }
  }
});