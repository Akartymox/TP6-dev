const originURL = window.location.origin + "/";

const form = document.querySelector("#shorten-form");
const result = document.querySelector("#result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = form.url.value;

  try {
    const response = await fetch(`${originURL}api-v2/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      result.innerHTML = `<p style="color:red">Erreur ${response.status} : ${error.message}</p>`;
      return;
    }

    const data = await response.json();
    result.innerHTML = `
      <div class="result">
        <p>Lien créé :</p>
        <a href="${data.short}" target="_blank">${data.short}</a>
        <button id="copy-btn" type="button">Copier</button>
      </div>
    `;

    document.querySelector("#copy-btn").addEventListener("click", async () => {
      await navigator.clipboard.writeText(data.short);
      document.querySelector("#copy-btn").textContent = "Copié !";
    });
  } catch (error) {
    result.innerHTML = `<p style="color:red">Erreur réseau : ${error.message}</p>`;
  }
});