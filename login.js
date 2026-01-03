// ________________________login
import supabase from "./config.js";
let loginForm = document.getElementById("sigin-form");

let lemail = document.getElementById("sigin-email");
let lpassword = document.getElementById("sigin-password");

async function login(e) {
  e.preventDefault();
  try {
    if (!lemail.value) {
      alert("plz enter your email");

      return;
    }
    if (!lpassword.value) {
      alert("plz enter your password");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: lemail.value,
      password: lpassword.value,
    });
    if (error) {
      console.log(error);
      return;
    } else {
      Swal.fire({
        title: "login",
        text: "congratulation , you are signed in",
        icon: "success",
      });

      location.href = "./index.html";
    }
  } catch (err) {
    console.log(err);
  }
}

loginForm && loginForm.addEventListener("submit", login);
