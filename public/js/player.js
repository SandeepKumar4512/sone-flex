// 🎧 SONE FLEX FINAL PLAYER (CLEAN + AUTH FIX)

const API = "http://localhost:5000";

/* ELEMENTS */
const player = document.getElementById("player");
const progress = document.getElementById("progress");
const miniPlayer = document.getElementById("miniPlayer");
const miniTitle = document.getElementById("miniTitle");
const miniArtist = document.getElementById("miniArtist");
const miniCover = document.getElementById("miniCover");
const playerUI = document.getElementById("playerUI");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const bgBlur = document.getElementById("bgBlur");
const playBtn = document.getElementById("playBtn");
const searchBox = document.getElementById("searchBox");

/* DATA */
let songs = [];
let index = 0;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

/* LOAD SONGS */
async function loadSongs(){
  const res = await fetch(API+"/api/songs");
  songs = await res.json();
  displaySongs(songs);

  if(songs.length > 0) updateHero(songs[0]);
}

/* DISPLAY SONGS */
function displaySongs(list){
  const container = document.getElementById("songs");
  container.innerHTML = "";

  list.forEach((song,i)=>{
    const div = document.createElement("div");
    div.className = "card";

    const heart = favorites.find(s=>s._id===song._id) ? "❤️" : "🤍";

    div.innerHTML = `
      <img src="${API}/${song.cover_image}">
      <div>${song.title}</div>
      <div>${song.artist}</div>
      <button class="playBtn">▶</button>
      <button class="favBtn">${heart}</button>
    `;

    div.querySelector(".playBtn").onclick = ()=>playSong(song,i);
    div.querySelector(".favBtn").onclick = ()=>{
      toggleFavorite(song);
      displaySongs(list);
    };
    div.querySelector("img").onclick = ()=>playSong(song,i);

    container.appendChild(div);
  });
}

/* PLAY SONG */
function playSong(song,i){
  index = i;
  player.src = API+"/"+song.audio_file;
  player.play();

  playBtn.innerText="⏸";

  miniPlayer.style.display="flex";
  miniTitle.innerText=song.title;
  miniArtist.innerText=song.artist;
  miniCover.src=API+"/"+song.cover_image;

  title.innerText=song.title;
  artist.innerText=song.artist;
  cover.src=API+"/"+song.cover_image;
  bgBlur.style.backgroundImage=`url(${API}/${song.cover_image})`;

  updateHero(song);
}

/* HERO */
function updateHero(song){
  document.querySelector(".hero h1").innerText = song.title;
  document.querySelector(".profile").src = API+"/"+song.cover_image;
}

/* CONTROLS */
function togglePlay(){
  if(player.paused){
    player.play();
    playBtn.innerText="⏸";
  } else {
    player.pause();
    playBtn.innerText="▶";
  }
}

function nextSong(){
  index = (index+1)%songs.length;
  playSong(songs[index],index);
}

function prevSong(){
  index = (index-1+songs.length)%songs.length;
  playSong(songs[index],index);
}

/* TIME */
player.ontimeupdate=()=>{
  if(player.duration){
    progress.value=(player.currentTime/player.duration)*100;
  }
};

progress.oninput=()=>{
  player.currentTime=(progress.value/100)*player.duration;
};

/* SEARCH */
if(searchBox){
  searchBox.addEventListener("input", ()=>{
    const q = searchBox.value.toLowerCase();
    const filtered = songs.filter(s=>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q)
    );
    displaySongs(filtered);
  });
}

/* FAVORITES */
function toggleFavorite(song){
  const i = favorites.findIndex(s=>s._id===song._id);

  if(i>-1){
    favorites.splice(i,1);
  } else {
    favorites.push(song);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function loadFavorites(){
  displaySongs(favorites);
}

/* AUTO NEXT */
player.onended = ()=> nextSong();

/* ================= AUTH ================= */

async function signup(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch(API+"/api/auth/signup",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({email,password})
  });

  alert("Signup done ✅");
}

async function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API+"/api/auth/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({email,password})
  });

  const data = await res.json();

  if(data.user){
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Login success 🔥");
    checkUser();
  }else{
    alert("Login failed ❌");
  }
}

/* USER UI */
function checkUser(){
  const user = JSON.parse(localStorage.getItem("user"));

  if(user){
    document.getElementById("email").style.display = "none";
    document.getElementById("password").style.display = "none";

    const old = document.getElementById("userBox");
    if(old) old.remove();

    const box = document.createElement("div");
    box.id = "userBox";
    box.style.color="white";
    box.style.padding="10px";

    box.innerHTML = `
      <h3>Welcome ${user.email} 👋</h3>
      <button onclick="logout()">Logout</button>
    `;

    document.body.prepend(box);
  }
}

function logout(){
  localStorage.removeItem("user");
  location.reload();
}

/* INIT */
loadSongs();
checkUser();
