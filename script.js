const generateBtn = document.getElementById("generate-btn");
const exportBtn = document.getElementById("export-btn");
const palette = document.querySelector(".palette-container");
const modeSelect = document.getElementById("mode");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

/* DARK MODE */
const savedTheme = localStorage.getItem("theme");
if(savedTheme === "dark"){
  body.classList.add("dark");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.onclick = () => {
  body.classList.toggle("dark");
  const dark = body.classList.contains("dark");
  themeToggle.innerHTML = dark 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';
  localStorage.setItem("theme", dark ? "dark" : "light");
};

/* GENERATE */
generateBtn.onclick = generatePalette;
document.addEventListener("keydown", e => e.code === "Space" && generatePalette());

palette.onclick = e => {
  const box = e.target.closest(".color-box");
  if(!box) return;

  if(e.target.classList.contains("copy-btn")){
    copyColor(box);
  }

  if(e.target.classList.contains("lock-btn")){
    toggleLock(box, e.target);
  }

  if(e.target.classList.contains("color")){
    copyColor(box);
  }
};

function toggleLock(box, icon){
  const locked = box.dataset.locked === "true";
  box.dataset.locked = !locked;
  icon.classList.toggle("locked");
}

function copyColor(box){
  const hex = box.querySelector(".hex-value").textContent;
  navigator.clipboard.writeText(hex);
  const icon = box.querySelector(".copy-btn");
  icon.classList.replace("fa-copy","fa-check");
  setTimeout(()=>icon.classList.replace("fa-check","fa-copy"),1200);
}

function generatePalette(){
  document.querySelectorAll(".color-box").forEach(box=>{
    if(box.dataset.locked === "true") return;

    const color = generateColor(modeSelect.value);
    box.querySelector(".color").style.background = color;
    box.querySelector(".hex-value").textContent = color;
  });
}

function generateColor(mode){
  if(mode==="pastel") return `hsl(${rand(0,360)},70%,85%)`;
  if(mode==="vibrant") return `hsl(${rand(0,360)},90%,55%)`;
  return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6,"0")}`;
}

function rand(min,max){
  return Math.floor(Math.random()*(max-min)+min);
}

exportBtn.onclick = () => {
  let css=":root{\n";
  document.querySelectorAll(".hex-value").forEach((v,i)=>{
    css+=`  --color-${i+1}: ${v.textContent};\n`;
  });
  css+="}";
  navigator.clipboard.writeText(css);
  alert("CSS Variables copied!");
};

generatePalette();
