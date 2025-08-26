async function loadPage(event, url) {
  event.preventDefault(); // prevent full page reload
  const res = await fetch(url);
  if (!res.ok) {
      document.getElementById('content').innerHTML = `<p>Page not found.</p>`;
      return;
  }
  const html = await res.text();
  document.getElementById('content').innerHTML = html;
}

// Load Home page initially
window.addEventListener('DOMContentLoaded', () => {
    loadPage(new Event('load'), 'Home/home.html');
});
