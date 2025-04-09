const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const signupForm = document.getElementById("signupForm");
const otpForm = document.getElementById("otpForm");

function openLogin() {
  loginModal.classList.add("active");
}

function closeAll() {
  loginModal.classList.remove("active");
  signupModal.classList.remove("active");
  otpForm.style.display = "none";
  signupForm.style.display = "block";
}

function switchToSignup() {
  loginModal.classList.remove("active");
  signupModal.classList.add("active");
  signupForm.style.display = "block";
  otpForm.style.display = "none";
}

function switchToLogin() {
  signupModal.classList.remove("active");
  loginModal.classList.add("active");
}

function showOTP() {
  signupForm.style.display = "none";
  otpForm.style.display = "block";
}