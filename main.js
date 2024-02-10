// ELEMENTS
const loadingBox = document.querySelector(".loading-box");
const moviesList = document.querySelector(".movies-list");
const errorText = document.querySelector(".error-text");
// API DATA
const API_KEY = "b370acb105f1057ee232ef2062dfa25d";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

// GET MOVIE FROM API
const getMovies = async () => {
  try {
    const response = await fetch(API_URL);
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
  if (movies.length !== 0) {
    movies.forEach((movie) => {
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
  
          <span class="movie-vote ">
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

// INITIAL CALL
getMovies();
