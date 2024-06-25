// movie deletion
async function deleteMovie(id) {
  // if the user confirms the deletion
  if (window.confirm("Are you sure you want to delete it?")) {
    try {
      const resp = await fetch(`/movies/${id}`, {
        method: "DELETE",
      });
      // if we get a 204 status response, the deletion was successful
      if (resp.status === 204) {
        const parent = document.getElementById(`row-${id}`);
        parent.remove();
        alert("Successful deletion!");
        // otherwise we wait for the body and alert the user about the error
      } else {
        const body = await resp.json();
        alert(body.message);
      }
    } catch (err) {
      alert(err);
    }
  }
}

// movie modification
async function editMovie(event) {
  try {
    // prevent the default synchronous form submission
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // get the button and the ID of the movie from it
    const button = form.lastElementChild;
    const id = parseInt(button.id.split("-")[1], 10);

    // get the from's input data
    const title = document.getElementById(`edited_title-${id}`).value;
    const year = document.getElementById(`edited_year-${id}`).value;
    const genre = document.getElementById(`edited_genre-${id}`).value;
    const description = document.getElementById(
      `edited_description-${id}`
    ).value;

    const values = [title, parseInt(year, 10), genre, description];

    // send the asynchronous call
    const resp = await fetch(`/movies/${id}`, {
      method: "PUT",
      body: formData,
    });

    // if we get a 204 status response the modification was successful
    if (resp.status === 204) {
      // modify the elements that display movie details
      const parent = document.getElementById(`row-${id}`);
      const { children } = parent;

      for (let i = 0; i < children.length - 1; i++) {
        children[i].textContent = values[i];
      }
      alert("Successfully edited!");
      // otherwise wait for the json body and alert user
    } else {
      const body = await resp.json();
      alert(body.message);
    }
  } catch (err) {
    alert(err);
  }
}

// new cover image upload
async function uploadNewCover(event) {
  try {
    // prevent the default synchronous form submission
    event.preventDefault();

    // get the form and the id of the movie from it
    const form = event.target;
    const id = parseInt(form.id.split("-")[1], 10);

    // construct the key value pairs
    const file = document.getElementById(`cover_photo-${id}`);
    const formData = new FormData();
    formData.append("cover_photo", file.files[0]);

    // send the asynchronous call
    const resp = await fetch(`/movies/${id}/covers`, {
      method: "PUT",
      body: formData,
    });

    // display message if the upload is successful
    if (resp.status === 204) {
      alert("Successful upload!");
      // otherwise wait for json response and alert user
    } else {
      const body = await resp.json();
      alert(body.message);
    }
  } catch (err) {
    alert(err);
  }
}

// assigning event listeners to buttons
window.onload = () => {
  const deleteButtons = document.getElementsByClassName("delete_button");

  Array.from(deleteButtons).forEach((button) => {
    button.addEventListener("click", () => {
      deleteMovie(button.id);
    });
  });

  const editForms = document.getElementsByClassName("edit-movie-form");
  Array.from(editForms).forEach((form) => {
    form.addEventListener("submit", editMovie);
  });

  const uploadForms = document.getElementsByClassName("upload-form");
  Array.from(uploadForms).forEach((form) => {
    form.addEventListener("submit", uploadNewCover);
  });
};
