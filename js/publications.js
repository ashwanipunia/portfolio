fetch("data/publications.json")
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
