const switcher = document.getElementById("profileSwitch");

if (switcher) {
  switcher.addEventListener("change", e => {
    document.body.setAttribute("data-profile", e.target.value);
  });
}
