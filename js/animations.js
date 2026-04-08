const obs=new IntersectionObserver(e=>{
e.forEach(x=>x.isIntersecting && x.target.classList.add("visible"));
},{threshold:0.15});

document.querySelectorAll(".fade-in").forEach(el=>obs.observe(el));
``const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".fade-in").forEach(el => {
  observer.observe(el);
});
