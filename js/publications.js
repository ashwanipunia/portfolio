fetch("data/publications.json")
.then(r => r.json())
.then(data => {
  const list = document.getElementById("publicationList");
  const y = document.getElementById("yearFilter");
  const j = document.getElementById("journalFilter");

  [...new Set(data.map(p=>p.year))].forEach(v=>y.innerHTML+=``);
  [...new Set(data.map(p=>p.journal))].forEach(v=>j.innerHTML+=``);

  function render(){
    list.innerHTML="";
    data.filter(p =>
      (y.value==="all" || p.year==y.value) &&
      (j.value==="all" || p.journal==j.value)
    ).forEach(p=>{
      list.innerHTML+=`
        <div class="pub-card">
          <h4>${p.title}</h4>
          <p>${p.journal} (${p.year}) — IF ${p.impact}</p>
        </div>`;
    });
  }

  y.onchange = j.onchange = render;
  render();
});
``fetch("data/publications.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("publicationList");
    container.innerHTML = "";

    data.forEach(pub => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${pub.title}</h3>
        <p><strong>${pub.journal}</strong> (${pub.year})</p>
        <p>Impact Factor: ${pub.impact}</p>
      `;

      container.appendChild(div);
    });
  })
  .catch(() => {
    document.getElementById("publicationList").innerHTML =
      "<p>Error loading publications.</p>";
  });
