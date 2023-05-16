// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("Nasa-Library JS imported successfully!");
});

async function saveFavorite(element, imageId) {
  element.style.color = "rgb(109, 100, 132)";
  const url = "/favorites";
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId }),
  });
}
