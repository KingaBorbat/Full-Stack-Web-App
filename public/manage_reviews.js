// review acceptance
async function acceptReview(button) {
  try {
    // send the asynchronous call
    const id = parseInt(button.id.split("-")[1], 10);
    const resp = await fetch(`/reviews/${id}/accept`, {
      method: "PUT",
    });

    // if it was successful, we disable the accept button and enable the reject button, and
    // change the displayed status
    if (resp.status === 204) {
      const reviewStatus = button.parentElement.previousElementSibling;
      button.disabled = true;
      button.nextElementSibling.disabled = false;
      reviewStatus.textContent = "accepted";
      // otherwise alert the user about the error
    } else {
      const body = await resp.json();
      alert(body.message);
    }
  } catch (err) {
    alert(err);
  }
}

// review rejection
async function rejectReview(button) {
  try {
    // send the asynchronous call
    const id = parseInt(button.id.split("-")[1], 10);
    const resp = await fetch(`/reviews/${id}/reject`, {
      method: "PUT",
    });

    // if the rejection was successful, we disable the reject button and enable the accept button,
    // and change the displayed status
    if (resp.status === 204) {
      const reviewStatus = button.parentElement.previousElementSibling;
      button.disabled = true;
      button.previousElementSibling.disabled = false;
      reviewStatus.textContent = "rejected";
      // otherwise alert the user about the error
    } else {
      const body = await resp.json();
      alert(body.message);
    }
  } catch (err) {
    alert(err);
  }
}

// enable and disable accept and reject buttons
function disableEnableButtons() {
  const reviewStatuses = document.getElementsByClassName("review-status");

  Array.from(reviewStatuses).forEach((reviewStatus) => {
    const buttonsCell = reviewStatus.nextElementSibling;
    if (buttonsCell) {
      const acceptButton = buttonsCell.firstElementChild;
      const rejectButton = buttonsCell.lastElementChild;

      // if the review is accepted
      if (reviewStatus.textContent === "accepted") {
        acceptButton.disabled = true;
        rejectButton.disabled = false;
        // otherwise if it's rejected
      } else if (reviewStatus.textContent === "rejected") {
        acceptButton.disabled = false;
        rejectButton.disabled = true;
      }
    }
  });
}

// assigning event listeners to buttons
window.onload = () => {
  disableEnableButtons();

  const acceptButtons = document.getElementsByClassName("accept-button");
  Array.from(acceptButtons).forEach((acceptButton) => {
    acceptButton.addEventListener("click", () => {
      acceptReview(acceptButton);
    });
  });

  const rejetcButtons = document.getElementsByClassName("reject-button");
  Array.from(rejetcButtons).forEach((rejectButton) => {
    rejectButton.addEventListener("click", () => {
      rejectReview(rejectButton);
    });
  });
};
