// Dummy logged-in user (tum login se set kar sakti ho)
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
  name: "Darius",
  id: "user_1"
};

localStorage.setItem("currentUser", JSON.stringify(currentUser));

let posts = JSON.parse(localStorage.getItem("posts")) || [];

/* ---------- FEED ---------- */
const feed = document.getElementById("feed");
if (feed) {
  document.getElementById("nav-username").innerText = currentUser.name;
  renderFeed();
}

function renderFeed() {
  feed.innerHTML = "";
  posts.forEach(post => {
    feed.innerHTML += `
      <div class="post">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <span>By ${post.author}</span>
      </div>
    `;
  });
}

/* ---------- PROFILE ---------- */
const myPosts = document.getElementById("my-posts");
if (myPosts) {
  document.getElementById("profile-name").innerText = currentUser.name;
  renderMyPosts();
}

function renderMyPosts() {
  myPosts.innerHTML = "";
  posts
    .filter(p => p.userId === currentUser.id)
    .forEach(post => {
      myPosts.innerHTML += `
        <div class="post">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
        </div>
      `;
    });
}

function createPost() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) return alert("Fill all fields");

  const newPost = {
    title,
    content,
    author: currentUser.name,
    userId: currentUser.id
  };

  posts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";

  renderMyPosts();
}

/* ---------- NAV ---------- */
function goToProfile() {
  window.location.href = "profile.html";
}

function goHome() {
  window.location.href = "home.html";
}
