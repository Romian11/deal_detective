const login_btn = document.getElementById("btn_signup");
const signup_btn = document.getElementById("btn_login");
const search_btn = document.getElementById("search_icon");
const phone = document.getElementById("phone");
const laptop = document.getElementById("laptop");
const tv = document.getElementById("tv");
const moniter = document.getElementById("moniter");
const camera = document.getElementById("camera");
const comparebtn = document.getElementsByClassName("compare_btn");
const buttons_login = document.getElementsByClassName("buttons_login");

var user = localStorage.getItem("login_info");

const logout_btn = document.getElementById("logout_btn");
console.log(logout_btn);
function login() {
  user = JSON.parse(user);
  if (user == null) {
    login_btn.style.display = "block";
    signup_btn.style.display = "block";
    redirectToLogin();
  } else {
    logout_btn.style.display = "block";
  }
  function redirectToLogin() {
    console.log("Redirecting to login");
    setTimeout(function () {
      window.location.href = "./login";
    }, 60000);
  }
}
login();
window.addEventListener("popstate", function (event) {
  location.reload();
});
logout_btn.addEventListener("click", () => {
  localStorage.removeItem("login_info");

  signup_btn.style.display = "block";
  login_btn.style.display = "block";
  logout_btn.style.display = "none";
  // location.reload();
});
signup_btn.addEventListener("click", () => {
  window.location = "/signup";
});

login_btn.addEventListener("click", () => {
  if (login_btn.innerHTML == "Log Out") {
    localStorage.removeItem("login_info");
    // location.reload();
    login_btn.innerHTML = "Log In";
    signup_btn.style.display = "block";
  } else window.location = "/login";
});

function search_item() {
  const search_element = document.getElementById("search_bar").value;
  performSearch(search_element);
}

function add(x) {
  const data = x.id;
  performSearch(data);
}

function performSearch(data) {
  var newUrl =
    window.location.origin + "/search?query=" + encodeURIComponent(data);
  window.history.pushState({ path: newUrl }, "", newUrl);
  window.location.href = newUrl;
}

document.addEventListener("keypress", function (event) {
  const search_element = document.getElementById("search_bar").value;
  if (event.keyCode === 13 && search_element != "") {
    performSearch(search_element);
  }
});
function return_home() {
  window.location.href = "/";
}

const card = document.getElementsByClassName("card");

function compare(title, link) {
  var newUrl =
    window.location.origin +
    "/compare?title=" +
    encodeURIComponent(title) +
    "&link=" +
    encodeURIComponent(link);
  window.history.pushState({ path: newUrl }, "", newUrl);
  window.location.href = newUrl;
}
