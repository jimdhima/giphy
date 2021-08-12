const apiKey = "GAyRjisTDFTp2InH50W62x0AWTzZUtvB";
let offset = 0;
document.getElementById("search_button").addEventListener("click", () => {
  handleSearchClick();
});
const modal = document.getElementById("modal");
let previousSearch = "";

function handleSearchClick() {
  const searchTerm = document.getElementById("search").value;
  const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${
    searchTerm || previousSearch
  }&limit=10&offset=${offset}&rating=g&lang=en`;
  previousSearch = searchTerm;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((response) => {
      const { data, pagination } = response;
      const container = document.getElementById("container_results");
      const paginationContainer = document.getElementById("pagination");
      paginationContainer.innerHTML = "";
      container.innerHTML = "";

      let totalCount = pagination?.total_count ?? 50;

      if (totalCount > 50) {
        totalCount = 5;
      } else {
        totalCount = Math.ceil(totalCount / 10);
      }

      for (let i = 1; i <= totalCount; i++) {
        const btn = document.createElement("button");

        btn.innerText = i;
        btn.setAttribute("type", "button");
        btn.addEventListener("click", () => changePage(i));

        paginationContainer.appendChild(btn);
      }

      if (!data.length) {
        container.innerText = "No data found";
      }

      for (const { images: image, title } of data) {
        const img = generateImageComponent(
          image.fixed_height_small_still.url,
          image.original.url,
          title
        );
        container.appendChild(img);
      }
    });
}

function generateImageComponent(thumbnailUrl, imageUrl, title) {
  const img = document.createElement("img");

  img.setAttribute("src", thumbnailUrl);
  img.addEventListener("click", (e) => {
    openModal(imageUrl, title);
  });
  img.classList.add("result_image");

  return img;
}

function changePage(pageNumber) {
  offset = pageNumber;
  handleSearchClick();
}

function openModal(url, title) {
  const currentState = modal.style.display || "none";
  // If modal is visible, hide it. Else, display it.
  if (currentState === "none") {
    modal.style.display = "block";

    const modalBody = document.getElementById("modal_body");
    const modalTitle = document.getElementById("modal_title");
    modalTitle.innerText = title;
    modalBody.innerHTML = "";

    const img = document.createElement("img");
    img.setAttribute("src", url);

    modalBody.appendChild(img);
    addModalListeners(modal);
  } else {
    modal.style.display = "none";
    removeModalListeners(modal);
  }
}

function addModalListeners() {
  modal.querySelector(".close_modal").addEventListener("click", openModal);
  modal.querySelector(".overlay").addEventListener("click", openModal);
}

function removeModalListeners() {
  modal.querySelector(".close_modal").removeEventListener("click", openModal);
  modal.querySelector(".overlay").removeEventListener("click", openModal);
}
