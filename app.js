// OMDb's free key supplied for this project. For a production app, proxy requests through a server.
const API_KEY = "66f64320";
const API_BASE = "https://www.omdbapi.com/";
const form = document.querySelector("#search-form");
const input = document.querySelector("#movie-search");
const typeFilter = document.querySelector("#type-filter");
const grid = document.querySelector("#movie-grid");
const status = document.querySelector("#status-message");
const title = document.querySelector("#results-title");
const count = document.querySelector("#results-count");
const template = document.querySelector("#movie-card-template");
const dialog = document.querySelector("#movie-dialog");
const dialogContent = document.querySelector("#dialog-content");
const fallbackPoster = "https://placehold.co/500x750/22231f/ccff00?text=REEL+FINDER";

function setStatus(message) { status.textContent = message; status.hidden = false; }
function posterUrl(item) { return item.Poster && item.Poster !== "N/A" ? item.Poster : fallbackPoster; }

async function searchMovies(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return;
  grid.innerHTML = "";
  title.textContent = `Results for “${cleanQuery}”`;
  count.textContent = "Searching…";
  setStatus("Finding titles in the catalog…");
  const params = new URLSearchParams({ s: cleanQuery, apikey: API_KEY });
  if (typeFilter.value) params.set("type", typeFilter.value);
  try {
    const response = await fetch(`${API_BASE}?${params}`);
    if (!response.ok) throw new Error("The movie service could not be reached.");
    const data = await response.json();
    if (data.Response === "False") {
      count.textContent = "No matches";
      setStatus(data.Error || "No titles found. Try a different search.");
      return;
    }
    count.textContent = `${data.totalResults} title${data.totalResults === "1" ? "" : "s"} found`;
    status.hidden = true;
    data.Search.forEach(renderCard);
  } catch (error) {
    count.textContent = "Connection issue";
    setStatus("Couldn’t load results right now. Check your internet connection and try again.");
  }
}

function renderCard(item) {
  const node = template.content.cloneNode(true);
  const card = node.querySelector(".movie-card");
  const image = node.querySelector(".poster");
  image.src = posterUrl(item); image.alt = `${item.Title} poster`;
  image.onerror = () => { image.src = fallbackPoster; };
  node.querySelector(".type-tag").textContent = item.Type;
  node.querySelector(".movie-year").textContent = item.Year;
  node.querySelector(".movie-title").textContent = item.Title;
  node.querySelector(".details-button").addEventListener("click", () => showDetails(item.imdbID));
  card.addEventListener("click", (event) => { if (event.target.tagName !== "BUTTON") showDetails(item.imdbID); });
  grid.append(node);
}

async function showDetails(id) {
  dialogContent.innerHTML = "<div class='dialog-copy'><p>Loading details…</p></div>";
  dialog.showModal();
  try {
    const response = await fetch(`${API_BASE}?${new URLSearchParams({ i: id, plot: "short", apikey: API_KEY })}`);
    const movie = await response.json();
    if (movie.Response === "False") throw new Error(movie.Error);
    dialogContent.innerHTML = `<div class="dialog-layout"><img src="${posterUrl(movie)}" alt="${movie.Title} poster"><div class="dialog-copy"><p class="dialog-meta">${movie.Year} · ${movie.Rated || "Unrated"} · ${movie.Runtime || "Runtime unavailable"}</p><h2>${movie.Title}</h2><p class="dialog-meta">${movie.Genre || "Genre unavailable"}</p><p>${movie.Plot || "No plot summary available."}</p><p class="dialog-meta">IMDb ${movie.imdbRating || "N/A"}/10 · ${movie.Director || "Director unavailable"}</p></div></div>`;
  } catch { dialogContent.innerHTML = "<div class='dialog-copy'><h2>Details unavailable</h2><p>Please try again in a moment.</p></div>"; }
}

form.addEventListener("submit", (event) => { event.preventDefault(); searchMovies(input.value); });
document.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => { input.value = button.dataset.query; searchMovies(input.value); }));
document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
