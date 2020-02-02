import {loadBooks} from "/scripts/books/results.mjs";
import {getSignature} from "/scripts/crypto.mjs";
import {showError} from "/scripts/error.mjs";

export async function removeEntry() {
  const id = this.parentElement.getAttribute("_id");
  if (id) {
    const body = {id: id};
    const str = JSON.stringify(body);

    const options = {
      method: "POST",
      headers: {
        "x-app-signature": await getSignature(str),
        "content-type": "application/json"
      },
      body: str
    };

    fetch("https://homequery.herokuapp.com/book/remove", options)
      .then(response => {
        if (response.ok) {
          loadBooks();
        } else {
          if (response.status === 403) {
            if (window.localStorage.getItem("token")) {
              showError("Sorry, the client token is incorrect.");
            } else {
              showError("Please enter the client token to modify the list.");
            }
          }
        }
      })
      .catch(err => {
        console.log("Error adding film:\n" + err);
        if (!navigator.onLine) {
          showError("Sorry, modifiying the list isn't possible while offline.");
        }
      });
  }
}