const API_KEY = "be579af0ea280c2d72aef7c5f9ec1ebb";



function openTrailer(id,type="movie"){

fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`)
.then(res=>res.json())
.then(data=>{

const trailer=data.results.find(
v=>v.type==="Trailer" && v.site==="YouTube"
);

if(trailer){
window.open(`https://www.youtube.com/watch?v=${trailer.key}`);
}else{
alert("Trailer not available");
}

});

}


/* load movies function */

function loadMovies(url,containerID,type="movie"){

fetch(url)
.then(res=>res.json())
.then(data=>{

const container=document.getElementById(containerID);

container.innerHTML="";

data.results.slice(0,16).forEach(movie=>{

const title=movie.title || movie.name;

const poster=`https://image.tmdb.org/t/p/w500${movie.poster_path}`;

container.innerHTML+=`

<div class="movie" onclick="openMovie(${movie.id},'${type}')">


<img src="${poster}">

<div class="movie-info">

<h3>${title}</h3>

<p>⭐ ${movie.vote_average}</p>

<button onclick="openTrailer(${movie.id},'${type}')">
Watch Trailer
</button>

</div>

</div>

`;

});

});

}

// poster 
const poster = document.getElementById("header-poster");
const title = document.getElementById("poster-title");

let movies = [];

const urls = [

`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`,
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=hi`,
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=en`,
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=ta`,
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_keywords=210024`,
`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`

];

async function loadHeaderMovies(){

for(let url of urls){

let res = await fetch(url);

let data = await res.json();

movies.push(...data.results.slice(0,2)); // 2 movies each category

}

changePoster();

}

let index = 0;

function changePoster(){

if(movies.length === 0) return;

const movie = movies[index];

poster.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

title.innerText = movie.title || movie.name; // movie ka actual name

index++;

if(index >= movies.length){
index = 0;
}

}

loadHeaderMovies();

setInterval(changePoster,4000);




/* Latest Movies */

loadMovies(
`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`,
"latest"
);

/* Bollywood */

loadMovies(
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=hi`,
"bollywood"
);

/* Hollywood */

loadMovies(
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=en`,
"hollywood"
);

/* South */

loadMovies(
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=ta`,
"south"
);
/* Anime Movies */

loadMovies(
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_keywords=210024`,
"anime"
);
/* Web Series */

loadMovies(
`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`,
"webseries",
"tv"
);


function openMovie(id,type="movie"){

Promise.all([

fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`),

fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`),

fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`)

])

.then(res=>Promise.all(res.map(r=>r.json())))

.then(([movie,credits,videos])=>{

const trailer=videos.results.find(
v=>v.type==="Trailer" && v.site==="YouTube"
);

const actors=credits.cast.slice(0,5).map(a=>a.name).join(", ");

document.getElementById("popup-poster").src =
`https://image.tmdb.org/t/p/w500${movie.poster_path}`;

document.getElementById("popup-title").innerText =
movie.title || movie.name;

document.getElementById("popup-rating").innerText =
"⭐ Rating: "+movie.vote_average;

document.getElementById("popup-actors").innerText =
"Actors: "+actors;

document.getElementById("popup-overview").innerText =
movie.overview;

document.getElementById("popup-trailer").innerHTML =
trailer ?
`<iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>`
:
"Trailer not available";

document.getElementById("movie-popup").style.display="flex";

});

}

function closePopup(){
document.getElementById("movie-popup").style.display="none";
}

window.onclick = function(e){
const popup = document.getElementById("movie-popup");
if(e.target === popup){
popup.style.display = "none";
}
}

function closePopup(){
document.getElementById("movie-popup").style.display="none";
}

// dark mode 
 

const toggle = document.getElementById("toggleMode");

// Load saved mode
if(localStorage.getItem("mode") === "light"){
  document.body.classList.add("light-mode");
  
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("light-mode");

  if(document.body.classList.contains("light-mode")){
    localStorage.setItem("mode", "light");
  } else {
    localStorage.setItem("mode", "dark");
  }
});


// search movie 

const input = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const results = document.getElementById("searchResults");

// 🔍 Suggestion
input.addEventListener("input", async () => {
  const query = input.value.trim();

  if (query.length < 2) {
    suggestions.style.display = "none";
    return;
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
  );
  const data = await res.json();

  suggestions.innerHTML = "";
  suggestions.style.display = "block";

  data.results.slice(0, 5).forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("suggestion-item");
    div.innerText = movie.title;

    div.onclick = () => {
      input.value = movie.title;
      suggestions.style.display = "none";
      searchMovie(movie.title);
    };

    suggestions.appendChild(div);
  });
});

// 🔥 ENTER PRESS SEARCH
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchMovie(input.value);
    suggestions.style.display = "none";
  }
});

// 🎬 SEARCH FUNCTION
async function searchMovie(query) {
  if (!query) return;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
  );
  const data = await res.json();

  results.innerHTML = "";

  data.results.forEach(movie => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");

    movieDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
      <h3>${movie.title}</h3>
      <button onclick="getTrailer(${movie.id})">Watch Trailer</button>
    `;

    results.appendChild(movieDiv);
  });

  // 🚀 AUTO SCROLL (FINAL FIX)
  setTimeout(() => {
    const element = document.getElementById("searchResults");
    const yOffset = -70; // navbar height adjust
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  }, 100);
}

// ▶️ TRAILER
async function getTrailer(movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await res.json();

  const trailer = data.results.find(
    vid => vid.type === "Trailer" && vid.site === "YouTube"
  );

  if (trailer) {
    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
  } else {
    alert("Trailer not available");
  }
}


