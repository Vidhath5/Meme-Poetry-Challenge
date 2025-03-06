let stack = 0;
let round = 0;
let poems = [];

const memes = [
  { name: "Distracted Boyfriend", image: "https://i.kym-cdn.com/photos/images/original/001/287/995/389.jpg" },
  { name: "Drake Hotline Bling", image: "https://i.kym-cdn.com/photos/images/original/001/026/318/0d6.jpg" },
  { name: "Success Kid", image: "https://i.kym-cdn.com/photos/images/original/000/001/384/success-kid.jpg" },
  { name: "Grumpy Cat", image: "https://i.kym-cdn.com/photos/images/original/000/381/389/0f7.jpg" },
  { name: "Pepe the Frog", image: "https://i.kym-cdn.com/photos/images/original/000/975/079/717.png" },
  { name: "Woman Yelling at a Cat", image: "https://i.kym-cdn.com/photos/images/original/001/671/914/5e7.jpg" },
  { name: "SpongeBob Mocking", image: "https://i.kym-cdn.com/photos/images/original/001/389/816/33f.jpg" },
  { name: "Expanding Brain", image: "https://i.kym-cdn.com/photos/images/original/001/235/772/2e8.jpg" },
  { name: "Change My Mind", image: "https://i.kym-cdn.com/photos/images/original/001/431/201/728.jpg" },
  { name: "One Does Not Simply Walk Into Mordor", image: "https://i.kym-cdn.com/photos/images/original/000/198/763/One_Does_Not_Simply_Walk_Into_Mordor.jpg" },
  { name: "Disaster Girl", image: "https://i.kym-cdn.com/photos/images/original/000/095/317/Disaster-Girl-Meme.jpg" },
  { name: "Bad Luck Brian", image: "https://i.kym-cdn.com/photos/images/original/000/293/590/6f6.jpg" },
  { name: "Trollface", image: "https://i.kym-cdn.com/photos/images/original/000/000/149/Whynotroll.jpg" },
  { name: "Doge", image: "https://i.kym-cdn.com/photos/images/original/000/581/296/c09.jpg" },
  { name: "Is This a Pigeon?", image: "https://i.kym-cdn.com/photos/images/original/001/380/193/23e.jpg" },
  { name: "Surprised Pikachu", image: "https://i.kym-cdn.com/photos/images/original/001/429/976/c1e.jpg" },
  { name: "Hide the Pain Harold", image: "https://i.kym-cdn.com/photos/images/original/000/879/077/587.jpg" },
  { name: "Salt Bae", image: "https://i.kym-cdn.com/photos/images/original/001/325/779/5a8.jpg" },
  { name: "Kermit the Frog (But That’s None of My Business)", image: "https://i.kym-cdn.com/photos/images/original/000/974/691/0b8.jpg" },
  { name: "Rickroll", image: "https://i.kym-cdn.com/photos/images/original/000/144/829/1281762387718.jpg" },
  { name: "Scumbag Steve", image: "https://i.kym-cdn.com/photos/images/original/000/077/077/Scumbag_Steve.jpg" },
  { name: "Overly Attached Girlfriend", image: "https://i.kym-cdn.com/photos/images/original/000/298/392/7fc.jpg" },
  { name: "Yo Dawg", image: "https://i.kym-cdn.com/photos/images/original/000/075/489/Yo_Dawg.jpg" },
  { name: "Ermahgerd", image: "https://i.kym-cdn.com/photos/images/original/000/306/977/4b3.jpg" },
  { name: "First World Problems", image: "https://i.kym-cdn.com/photos/images/original/000/215/672/First_World_Problems.jpg" },
  { name: "Philosoraptor", image: "https://i.kym-cdn.com/photos/images/original/000/027/217/Philosoraptor.jpg" },
  { name: "Arthur Fist", image: "https://i.kym-cdn.com/photos/images/original/001/291/461/8e8.jpg" },
  { name: "This Is Fine", image: "https://i.kym-cdn.com/photos/images/original/001/026/152/88a.jpg" },
  { name: "Distracted Cat", image: "https://i.kym-cdn.com/photos/images/original/001/671/914/5e7.jpg" },
  { name: "Galaxy Brain", image: "https://i.kym-cdn.com/photos/images/original/001/235/772/2e8.jpg" }
];

function startGame() {
  stack = 0;
  round = 0;
  poems = [];
  document.getElementById("stack-display").innerText = "Stack: 0";
  document.getElementById("score-display").innerText = "";
  document.getElementById("poem-compilation").innerText = "";
  fetch('/start')
    .then(res => res.json())
    .then(data => {
      document.getElementById("meme-display").innerText = `Round 1: ${data.meme}`;
      document.getElementById("meme-image").src = data.image;
      document.getElementById("meme-image").style.display = "block";
    })
    .catch(err => console.error("Start failed:", err));
}

function nextMeme() {
  if (round >= 10) {
    endGame();
    return;
  }
  round++;
  fetch('/next')
    .then(res => res.json())
    .then(data => {
      if (data.gameOver) {
        alert("Game Over! Stack overflow or 10 rounds completed.");
        endGame();
      } else {
        document.getElementById("meme-display").innerText = `Round ${round}: ${data.meme}`;
        document.getElementById("meme-image").src = data.image;
        document.getElementById("meme-image").style.display = "block";
        document.getElementById("poem-input").value = "";
      }
    });
}

function submitPoem() {
  const poem = document.getElementById("poem-input").value.trim();
  if (!poem) {
    alert("Please write a poem first!");
    return;
  }
  const meme = document.getElementById("meme-display").innerText.split(": ")[1];
  fetch('/submit', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poem, meme })
  })
  .then(res => res.json())
  .then(data => {
    stack = data.stack;
    poems.push(poem);
    document.getElementById("score-display").innerText = `Score: ${data.score}/12, Missed: ${data.missedPoints}`;
    document.getElementById("stack-display").innerText = `Stack: ${stack}`;
    if (stack >= 50) {
      alert("Stack Overflow! Game Over!");
      endGame();
    }
  });
}

function scoreCheck() {
  fetch('/score-check')
    .then(res => res.json())
    .then(data => {
      alert(`Current Stack: ${data.stack}`);
    });
}

function endGame() {
  fetch('/end')
    .then(res => res.json())
    .then(data => {
      const compilation = data.poems.length ? "Your Poems:\n" + data.poems.join("\n\n") : "No poems yet!";
      document.getElementById("poem-compilation").innerText = compilation;
      document.getElementById("meme-display").innerText = "Game Over!";
      document.getElementById("meme-image").style.display = "none";
    });
}