// ELEMENTS
const loadingBox = document.querySelector(".loading-box");
const moviesList = document.querySelector(".movies-list");
const errorText = document.querySelector(".error-text");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
// API DATA
const API_KEY = "b370acb105f1057ee232ef2062dfa25d";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
const SEARCH_API =
  "https://api.themoviedb.org/3/search/movie?api_key=API_KEY&query=";
// GET MOVIE FROM API
const getMovies = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    loadingBox.style.display = "none";
    errorText.innerHTML = "";
    showMovies(data.results);
  } catch (error) {
    errorText.innerHTML = error.message;
    loadingBox.style.display = "none";
  }
};
// SHOW MOVIE IN DOM
const showMovies = (movies) => {
  moviesList.innerHTML = "";
  const filteredMovies = movies.filter((movie) => movie.poster_path !== null);
  if (filteredMovies.length !== 0) {
    filteredMovies.forEach((movie) => {
      const { poster_path, title, vote_average, overview } = movie;
      const movieItem = `
      <div class="movie-item">
        <div class="poster-wrapper">
          <img 
          src=${IMAGE_PATH + poster_path}
          alt=${title}
          class="poster-img"
          />
  
          <div class="overview-box">
            <h4 class="overview-title">overview :</h4>
            ${overview}
          </div>
  
        </div>
  
        <div class="info-box">
          <h4 class="movie-name">${title}</h4>
  
          <span class="movie-vote ${getCLassByVote(vote_average)}">
            ${vote_average}
            <i class="fa fa-star"></i>
          </span>
  
        </div>
  
      </div>
      `;
      moviesList.innerHTML += movieItem;
    });
  }
};
// GIVE DYNAMIC CLASS BY ITS VOTE
const getCLassByVote = (vote) => {
  if (vote >= 8) {
    return "green-vote";
  } else if (vote <= 5) {
    return "red-vote";
  } else {
    return "orange-vote";
  }
};
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchedValue = searchInput.value;
  if (searchedValue) {
    getMovies(SEARCH_API + searchedValue);
    searchInput.value = "";
  }
});
// INITIAL CALL
getMovies(API_URL);
