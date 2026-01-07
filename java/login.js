// ====================== login ===================

const container = document.querySelector(".container");
const registerBtn = document.querySelector(".registro-btn");
const loginBtn = document.querySelector(".login-butn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});
