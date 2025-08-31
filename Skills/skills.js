document.getElementById("content").addEventListener("click", (e) => {
  if (e.target.classList.contains("skill-btn")) {
    const details = e.target.nextElementSibling;
    details.classList.toggle("active");

    if (details.classList.contains("active")) {
      // expand to full scrollHeight
      details.style.maxHeight = details.scrollHeight + "px";
    } else {
      // collapse back
      details.style.maxHeight = "0";
    }
  }
});