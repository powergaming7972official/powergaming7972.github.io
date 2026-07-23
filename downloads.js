document.querySelectorAll(".download-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

let count=localStorage.getItem("downloads")||0;

count++;

localStorage.setItem("downloads",count);

});

});