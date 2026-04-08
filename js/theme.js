const btn = document.getElementById("themeToggle");
if (btn) {
  btn.onclick = () => {
    document.body.classList.toggle("dark");
    btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  };
}
