const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const otpModel = document.getElementById("otpModel");

function openLogin() {
  loginModal.classList.add("active");
}

function closeAll() {
  loginModal.classList.remove("active");
  signupModal.classList.remove("active");
  otpModel.classList.remove("active");
}

function switchToSignup() {
  loginModal.classList.remove("active");
  signupModal.classList.add("active");
}

function switchToLogin() {
  signupModal.classList.remove("active");
  otpModel.classList.remove("active");
  loginModal.classList.add("active");
}

function showOTP() {
  signupModal.classList.remove("active");
  loginModal.classList.remove("active");
  otpModel.classList.add("active");
}