// give admin role to user
async function giveAdminRole() {
  try {
    if (
      window.confirm(
        "Are you sure you want to give admin role to the selected user/users?"
      )
    ) {
      const checkedUserIds = [];
      // get the selected checkboxes
      const checkBoxes = document.getElementsByClassName("user_checkbox");

      // get the selected users' ID
      Array.from(checkBoxes).forEach((checkbox) => {
        if (checkbox.checked) {
          checkedUserIds.push(checkbox.value);
          checkbox.checked = false;
        }
      });

      const promises = [];
      const cells = [];

      // for every user (if they aren't already admins) send an asynchronous call
      checkedUserIds.forEach((userID) => {
        const cell = document.getElementById(`td_role-${userID}`);
        if (cell.textContent !== "admin") {
          promises.push(fetch(`/users/${userID}/admin`, { method: "PUT" }));
        }
        cells.push(cell);
      });

      const results = await Promise.all(promises);

      // if the response status is 204, change the text of the element that displays the role
      const bodies = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i].status === 204) {
          cells[i].textContent = "admin";
        } else {
          bodies.push(results[i].json());
        }
      }

      // alert the user about the error(s)
      if (bodies.length > 0) {
        const bodyResults = await Promise.all(bodies);
        alert(bodyResults.join("; "));
      }
    }
  } catch (err) {
    alert(err);
  }
}

// remove admin role from user
async function removeAdminRole() {
  try {
    if (
      window.confirm(
        "Are you sure you want to remove admin role from the selected user/users?"
      )
    ) {
      const checkedUserIds = [];
      // get the selected checkboxes
      const checkBoxes = document.getElementsByClassName("user_checkbox");

      // get the selected users' ID
      Array.from(checkBoxes).forEach((checkbox) => {
        if (checkbox.checked) {
          checkedUserIds.push(checkbox.value);
          checkbox.checked = false;
        }
      });

      const promises = [];
      const cells = [];

      // for every user (if they have admin role) send an asynchronous call
      checkedUserIds.forEach((userID) => {
        const cell = document.getElementById(`td_role-${userID}`);
        if (cell.textContent === "admin") {
          promises.push(fetch(`/users/${userID}/user`, { method: "PUT" }));
        }
        cells.push(cell);
      });

      const results = await Promise.all(promises);
      const bodies = [];

      // if the response status is 204, change the text of the element that displays the role
      for (let i = 0; i < results.length; i++) {
        if (results[i].status === 204) {
          cells[i].textContent = "user";
        } else {
          bodies.push(results[i].json());
        }
      }

      // alert the user about error(s)
      if (bodies.length > 0) {
        const bodyResults = await Promise.all(bodies);
        alert(bodyResults.join("; "));
      }
    }
  } catch (err) {
    alert(err);
  }
}

// assigning event listeners to buttons
window.onload = () => {
  const giveAdminRoleBtn = document.getElementById("give_admin_role");
  giveAdminRoleBtn.addEventListener("click", () => {
    giveAdminRole();
  });

  const removeAdminRoleBtn = document.getElementById("remove_admin_role");
  removeAdminRoleBtn.addEventListener("click", () => {
    removeAdminRole();
  });
};
