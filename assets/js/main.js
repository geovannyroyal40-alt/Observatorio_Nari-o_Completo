document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
  }
  document.querySelectorAll("#mobileMenu a").forEach(a => {
    a.addEventListener("click", () => mobileMenu.classList.add("hidden"));
  });
});
