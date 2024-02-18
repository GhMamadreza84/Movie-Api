const loadingBox = document.querySelector(".loading-box");
const moviesList = document.querySelector(".movies-list");
const errorText = document.querySelector(".error-text");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const warningText = document.querySelector(".warning-text");
const paginationBox = document.querySelector(".pagination-box");
const headerTitle = document.querySelector(".header-title");
const nextPageButton = document.querySelector("#next-page-btn");
const prevPageButton = document.querySelector("#prev-page-btn");
const currentPageText = document.querySelector(".current-page");

let currentPage = 1;
let nextPage = null;
let prevPage = null;
let totalPages = null;
let lastUrl = "";

// API DATA
const API_KEY = "384346cec9e678f6b0e9e958c7e81669";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${currentPage}`;
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

// Get Movies From API
const getMovies = async (url) => {
  lastUrl = url;
  try {
    const response = await fetch(url);
    const data = await response.json();

    loadingBox.style.display = "none";
    errorText.innerHTML = "";
    warningText.innerHTML = "";

    paginationBox.style.display = "flex";

    // update pagination data
    currentPage = data.page;
    totalPages = data.total_pages;

    currentPageText.innerHTML = currentPage;

    // back top of the page when data changed
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    if (currentPage <= 1) {
      prevPageButton.classList.add("disable-btn");
      nextPageButton.classList.remove("disable-btn");
    } else if (currentPage >= totalPages) {
      prevPageButton.classList.remove("disable-btn");
      nextPageButton.classList.add("disable-btn");
    } else {
      prevPageButton.classList.remove("disable-btn");
      nextPageButton.classList.remove("disable-btn");
    }

    showMovies(data.results);
  } catch (error) {
    errorText.innerHTML = error.message;
    loadingBox.style.display = "none";
    paginationBox.style.display = "none";
  }
};

// Show Movies In DOM
const showMovies = (movies) => {
  moviesList.innerHTML = ""; // reset movies list

  const filteredMovies = movies.filter((movie) => movie.poster_path !== null);

  // check if movie exists
  if (filteredMovies.length !== 0) {
    filteredMovies.forEach((movie) => {
      const { poster_path, title, vote_average, overview } = movie;

      const movieItem = `
      <div class='movie-item'>
        <div class='poster-wrapper'>
          <img
          src="${IMAGE_PATH + poster_path}"
          alt="${title}"
          class='poster-img'
          />

          <div class='overview-box'>
            <h4 class='overview-title'>overview:</h4>
              ${overview}
          </div>
        </div>

        <div class='info-box'>
          <h4 class='movie-name'>${title}</h4>
          <span class='movie-vote ${getClassByVote(vote_average)}'>
            ${vote_average}
            <i class='fa fa-star'></i>
          </span>
        </div>
    </div>
  `;
      // append movies in DOM
      moviesList.innerHTML += movieItem;
    });
  } else {
    warningText.innerHTML = "No Results Found!";
    paginationBox.style.display = "none";
  }
};

// give dynamic class by its vote
const getClassByVote = (vote) => {
  if (vote >= 8) {
    return "green-vote";
  } else if (vote <= 5) {
    return "red-vote";
  } else {
    return "orange-vote";
  }
};

// reset page by clicking header title
headerTitle.addEventListener("click", () => getMovies(API_URL));

// search handeling
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchedValue = searchInput.value;

  if (searchedValue) {
    // active loading mode
    loadingBox.style.display = "grid";
    moviesList.innerHTML = "";

    getMovies(SEARCH_API + searchedValue);
    searchInput.value = "";
  }
});

nextPageButton.addEventListener("click", () => {
  nextPage = currentPage + 1;
  if (nextPage <= totalPages) {
    callPage(nextPage);
  }
});

prevPageButton.addEventListener("click", () => {
  prevPage = currentPage - 1;
  if (prevPage >= 1) {
    callPage(prevPage);
  }
});

const callPage = (page) => {
  // active loading mode
  loadingBox.style.display = "grid";
  moviesList.innerHTML = "";

  const urlSplit = lastUrl.split("?");
  const searchParams = new URLSearchParams(urlSplit[1]);
  searchParams.set("page", page);

  const url = urlSplit[0] + "?" + searchParams.toString();

  getMovies(url);
};

// Initial call
getMovies(API_URL);
