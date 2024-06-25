// delete review
async function deleteReview(id) {
  // if the user confirms the deletion
  if (window.confirm("Are you sure you want to delete it?")) {
    try {
      const resp = await fetch(`/reviews/${id}`, {
        method: "DELETE",
      });
      // if the response status is 204, remove the element that displays the review
      if (resp.status === 204) {
        const parent = document.getElementById(`review-${id}`);
        parent.remove();
        alert("Successful deletion!");
        // otherwise wait for the json response and alert the user about the error
      } else {
        const body = await resp.json();
        alert(body.message);
      }
    } catch (err) {
      alert(err);
    }
  }
}

// modify review
async function editReview(event) {
  try {
    // prevent default, synchronous form submission
    event.preventDefault();

    // construct automatically the form data
    const form = event.target;
    const formData = new FormData(form);

    // get the submitter button and get the id of the review from it
    const button = form.lastElementChild;
    const id = parseInt(button.id.split("-")[1], 10);

    // send the asynchronous call
    const resp = await fetch(`/reviews/${id}`, {
      method: "PUT",
      body: formData,
    });

    // get the form inputs' value
    const points = document.getElementById(`edited_points-${id}`).value;
    const review = document.getElementById(`edited_review-${id}`).value;

    // if the reponse status is 204 then the modification was successful and we modify the
    // corresponding elements on the page
    if (resp.status === 204) {
      const parent = document.getElementById(`review-${id}`);
      const divs = parent.getElementsByTagName("div");
      const pReview = parent.lastElementChild;
      const statusSpan = parent.firstElementChild.firstElementChild;
      const lastDiv = divs[divs.length - 1];
      pReview.textContent = `Review: ${review}`;
      lastDiv.lastElementChild.textContent = `${points}/10`;
      if (statusSpan) {
        statusSpan.textContent = "Status: pending";
      }

      alert("Successfully edited!");
      // otherwise wait for the json response and alert the user about the error
    } else {
      const body = await resp.json();
      alert(body.message);
    }
  } catch (err) {
    alert(err);
  }
}

// assigning event listeneres to the delete button and editor form
window.onload = () => {
  const deleteButtons = document.getElementsByClassName("delete_button");
  Array.from(deleteButtons).forEach((button) => {
    button.addEventListener("click", () => {
      deleteReview(button.id);
    });
  });

  const editForms = document.getElementsByClassName("edit-review-form");
  Array.from(editForms).forEach((form) => {
    form.addEventListener("submit", editReview);
  });
};
