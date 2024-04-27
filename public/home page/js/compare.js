const login_btn = document.getElementById("btn_signup");
const signup_btn = document.getElementById("btn_login");
const search_btn = document.getElementById("search_icon");
const phone = document.getElementById("phone");
const laptop = document.getElementById("laptop");
const tv = document.getElementById("tv");
const moniter = document.getElementById("moniter");
const camera = document.getElementById("camera");

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
    }, 600000);
  }
}
login();

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
  window.location = "/login";
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

// const flipkartButton = document.getElementById("buy_btn2");

// const btn_img2 = document.getElementById("btn_img2");

// flipkartButton.addEventListener("mouseenter", () => {
//   btn_img2.style.display = "inline-block";
//   flipkartButton.style.width = "150px";
// });
// flipkartButton.addEventListener("mouseleave", () => {
//   flipkartButton.style.width = "120px";
//   btn_img2.style.display = "none";
// });
// const btn_img1 = document.getElementById("btn_img1");
// const amazonButton = document.getElementById("buy_btn1");
// amazonButton.addEventListener("mouseenter", () => {
//   btn_img1.style.display = "inline-block";
//   amazonButton.style.width = "150px";
// });
// amazonButton.addEventListener("mouseleave", () => {
//   amazonButton.style.width = "120px";
//   btn_img1.style.display = "none";
// });
window.addEventListener('popstate', function(event) {
  location.reload();
});
function opensite(url) {
  if (url == "") return;
  window.open(url);
}
