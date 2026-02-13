const content = document.getElementById('content');

async function loadPage(event, url) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      content.innerHTML = '<p>Page not found.</p>';
    } 
    else {
      const html = await res.text();
      content.innerHTML = html;
    }
  } 
  catch (err) {
    console.error('Fetch error:', err);
    content.innerHTML = '<p>Error loading page.</p>';
  }

  if (url.includes("3d_/")) {
    window.enableGameMode?.();
    window.bind3DUI?.();
  } 
  else {
    window.enableSimulation?.();
  }

  const navLis = document.querySelectorAll('.navbar ul li');
  navLis.forEach(item => item.classList.remove('active'));

  if (event) {
    const link = event.target && event.target.closest ? event.target.closest('a') : null;
    const li = link ? link.closest('li') : null;
    if (li) {
      li.classList.add('active');
    }
  } 
  else {
    const homeLi = document.querySelector(".navbar ul li a[href='Home/home.html']")?.closest('li') ||
                   document.querySelector('.navbar ul li');
    if (homeLi) {
      homeLi.classList.add('active');
    } 
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('DOMContentLoaded', () => {
  loadPage(null, 'Home/home.html');
});
