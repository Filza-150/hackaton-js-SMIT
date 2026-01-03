import supabase from "./config.js";

let regFrom = document.getElementById("sigup-form");
//FOR SIGNUP setup first time  go your project -> authentication -> signin/providers ->
// 1.Confirm email <disabled> 2. enabled email

let semail = document.getElementById("sigup-email");
let spassword = document.getElementById("sigup-password");
let sname = document.getElementById("sigup-name");


async function signup(e) {
  e.preventDefault();
  try {
    if (!semail.value) {
      alert("plz enter your email");

      return;
    }
    if (!spassword.value) {
      alert("plz enter your password");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: semail.value,
      password: spassword.value,
      options: {
        data: {
          Name: sname.value,
          role:'user'
        },
      },
    });

    if (data) {
      console.log(data);
     const {id,user_metadata} = data.user
  
  


      const { error:dberr } = await supabase
  .from('customers')
  .insert({ uid: id, username: user_metadata.Name,email: user_metadata.email,
    role:user_metadata.role
   })
  if(dberr){
    console.log(dberr);
    
  }else{
    alert('signup succesfully')
    location.href = './index.html'
  }


    } else {
      console.log(error);
    }
  } catch (err) {
    console.log(err);
  }
}

regFrom && regFrom.addEventListener("submit", signup);



// //logout functionality___________________________________
let logoutBtn = document.getElementById("logBtn");

async function logout(e) {
  e.preventDefault()
  
  try {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      alert("logout successfully");
     
    }
  } catch (er) {
    console.log(er);
  }
}

logoutBtn && logoutBtn.addEventListener("click", logout);
