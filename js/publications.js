fetch("data/publications.json")
  .then(res => res.json())
  .then(pubs => {
    document.getElementById("publicationList").innerHTML =
      pubs.map(p => `
        <div class="card fade-in">
          <h4>${p.title}</h4>
          <p><strong>${p.journal}</strong> (${p.year})</p>
          <p>Impact Factor: ${p.impact}</p>
        </div>
      `).join("");
  });
``