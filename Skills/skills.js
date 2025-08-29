document.querySelectorAll(".skill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const details = btn.nextElementSibling; //<div class="skill-details">
        details.classList.toggle("active");
    });
});