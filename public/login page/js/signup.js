import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUS7Upt8JehycnqL7hb1TYL3I7OVgLx8w",
  authDomain: "login-final-d10c1.firebaseapp.com",
  projectId: "login-final-d10c1",
  storageBucket: "login-final-d10c1.appspot.com",
  messagingSenderId: "852511096538",
  appId: "1:852511096538:web:d7a2a33ad1c3bddb806fe3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

var email = document.getElementById("email");
var password = document.getElementById("password");
var confirm_password = document.getElementById("confirm_password");

window.signup = function (e) {
  e.preventDefault();
  var obj = {
    email: email.value,
    password: password.value,
    confirm_password: confirm_password.value,
  };
  var json = JSON.stringify(obj);

  if (obj.confirm_password == obj.password) {
    createUserWithEmailAndPassword(auth, obj.email, obj.password)
      .then(function (success) {
        localStorage.setItem("login_info", json);
        console.log("user added successfully");
        window.location = "./";
      })
      .catch(function (err) {
        alert("error" + err);
      });
    // console.log(obj);
  } else {
    alert("password does not match");
  }
};
window.addEventListener("popstate", function (event) {
  location.reload();
});
