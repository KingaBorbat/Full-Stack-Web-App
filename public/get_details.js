// shows the details of a movie
async function showDetails(div, id) {
  try {
    // wait for the details
    const details = await fetch(`/movies/${id}`);
    const response = await details.json();

    // get the elements that display the genre and description
    const pGenre = div.getElementsByClassName("genre_info")[0];
    const pDescription = div.getElementsByClassName("details_info")[0];

    // get the genre and description from the json response
    const { genre } = response;
    const { description } = response;

    // set the text content of the elements
    pGenre.textContent = `Genre: ${genre}`;
    pDescription.textContent = `Description: ${description}`;

    // show the elements
    pGenre.style.display = "block";
    pDescription.style.display = "block";
  } catch (err) {
    alert(err);
  }
}

// assign event listener to 'movie' div
window.onload = () => {
  const movieDivs = document.getElementsByClassName("movie");
  Array.from(movieDivs).forEach((movie) => {
    movie.addEventListener("click", () => {
      const info = movie.getElementsByClassName("info")[0];
      showDetails(info, info.id);
    });
  });
};
