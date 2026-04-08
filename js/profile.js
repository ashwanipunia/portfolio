const profile = document.getElementById("profileToggle");
if (profile) {
  profile.onchange = e => {
    document.body.setAttribute("data-profile", e.target.value);
  };
}
