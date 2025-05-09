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

// Function to check if the user exists in the database
function checkUserExistence() {
  const phoneNumber = document.getElementById("loginPhone").value;

  // Check if the phone number is valid
  if (!phoneNumber) {
    alert("Please enter a valid phone number.");
    return;
  }

  // Send the phone number to the backend to check if the user exists
  fetch('/check_user_existence', {
    method: 'POST',
    body: new URLSearchParams({ 'phone_number': phoneNumber }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  .then(response => response.json())
  .then(data => {
    if (data.exists) {
      // User exists, show OTP modal
      showOTP();
      sendOTP();
    } else {
      // User doesn't exist, redirect to signup page
      switchToSignup();
    }
  })
  .catch(error => {
    console.error("Error checking user existence:", error);
    alert("An error occurred. Please try again.");
  });
}

// Function to send OTP and move to OTP verification screen
function sendOTP() {
  const phoneNumber = document.getElementById("loginPhone").value;

  // Send OTP to the backend
  fetch('/send_otp', {
    method: 'POST',
    body: new URLSearchParams({ 'phone_number': phoneNumber }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert("OTP sent successfully!");
      // Move to OTP verification modal
      showOTP();
    } else {
      alert("Failed to send OTP.");
    }
  })
  .catch(error => {
    console.error("Error sending OTP:", error);
    alert("An error occurred. Please try again.");
  });
}

// Function to verify OTP
function verifyOTP() {
  const phoneNumber = document.getElementById("loginPhone").value;
  const otp = document.getElementById("otpInput").value;

  // Send OTP verification request to the backend
  fetch('/verify_otp', {
    method: 'POST',
    body: new URLSearchParams({ 'phone_number': phoneNumber, 'otp': otp }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert("OTP verified successfully!");
      // Proceed with login or other actions
      Create_user(Username,phoneNumber)
      closeAll();
    } else {
      alert("Invalid OTP.");
    }
  })
  .catch(error => {
    console.error("Error verifying OTP:", error);
    alert("An error occurred. Please try again.");
  });
}

// Function to send user details and create a new user
let Username = "";
function sendSignUpData() {
  Username = document.getElementById("name").value;
  const phoneNumber = document.getElementById("phone").value;

  // Validate input fields
  if (!Username || !phoneNumber) {
    alert("Please enter both your name and phone number.");
    return;
  }
  fetch('/check_user_existence', {
    method: 'POST',
    body: new URLSearchParams({ 'phone_number': phoneNumber }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  .then(response => response.json())
  .then(data => {
    if (!data.exists) {
      // User exists, show OTP modal
      showOTP();
      sendOTP();
    } else {
      // User doesn't exist, redirect to signup page
      alert("Already existing member! Please log in");
      showOTP();
      sendOTP();
    }
  })

}

function Create_user(name,phoneNumber){
  fetch('/signup_user', {
    method: 'POST',
    body: new URLSearchParams({ 'name': name, 'phone_number': phoneNumber }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert(data.message);
      // Proceed to login or other actions
    } else {
      alert("Failed to create user. Please try again.");
    }
  })
  .catch(error => {
    console.error("Error creating user:", error);
    alert("An error occurred. Please try again.");
  });
}
