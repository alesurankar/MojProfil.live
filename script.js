// script.js
const content = document.getElementById('content');

async function loadPage(event, url) {
  // If called from a click handler, prevent the default navigation
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  // Load the page HTML
  try {
    const res = await fetch(url);
    if (!res.ok) {
      content.innerHTML = '<p>Page not found.</p>';
    } else {
      const html = await res.text();
      content.innerHTML = html;
    }
  } catch (err) {
    console.error('Fetch error:', err);
    content.innerHTML = '<p>Error loading page.</p>';
  }

  // Update active class on navbar
  const navLis = document.querySelectorAll('.navbar ul li');
  navLis.forEach(item => item.classList.remove('active'));

  if (event) {
    // When clicking, event.target might be the <i> inside the <a>.
    // Use closest() to find the <a>, then its <li>.
    const link = event.target && event.target.closest ? event.target.closest('a') : null;
    const li = link ? link.closest('li') : null;
    if (li) {
      li.classList.add('active');
    }
  } else {
    // Programmatic load (e.g. initial load) — mark Home active (fall back to first li)
    const homeLi = document.querySelector(".navbar ul li a[href='Home/home.html']")?.closest('li') ||
                   document.querySelector('.navbar ul li');
    if (homeLi) homeLi.classList.add('active');
  }

  // optional: scroll to top of content smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load Home by default on initial page load (no event)
window.addEventListener('DOMContentLoaded', () => {
  loadPage(null, 'Home/home.html');
});
