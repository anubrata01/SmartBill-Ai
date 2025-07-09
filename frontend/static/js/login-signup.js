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
// variable to hold phone number
let phoneNumber='';
let Username = "";
// Function to login
function login(){
  phoneNumber = document.getElementById("LoginPhone").value;
  checkUserExistence(phoneNumber);
}
// Function to check if the user exists in the database
function checkUserExistence(phone) {
  phoneNumber = phone;

  // Check if the phone number is valid
  if (!phoneNumber) {
    alert("Please enter a valid phone number.");
    return;
  }
  showLoader();
  // Send the phone number to the backend to check if the user exists
  fetch('/check_user_existence', {
    method: 'POST',
    body: new URLSearchParams({ 'phone_number': phoneNumber }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  .then(response => response.json())
  .then(data => {
    hideLoader();
    if (data.exists) {
      // User exists, show OTP modal
      Username = data.exists.FullName ;
      sendOTP(phone);
    } else {
      // User doesn't exist, redirect to signup page
      switchToSignup();
    }
  })
  .catch(error => {
    hideLoader();
    console.error("Error checking user existence:", error);
    alert("An error occurred. Please try again.");
  });
}

// Function to send OTP and move to OTP verification screen
function sendOTP(phone) {
  phoneNumber = phone;
  console.log(phoneNumber)
  // Send OTP to the backend
  showLoader(); // Show loader
  fetch('/send_otp', {
    method: 'POST',
    body: new URLSearchParams({ 'phone_number': phone }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  .then(response => response.json())
  .then(data => {
    hideLoader();
    if (data.message) {
      alert("OTP sent successfully!");
      // Move to OTP verification modal
      showOTP();
    } else {
      alert("Failed to send OTP.");
    }
  })
  .catch(error => {
    hideLoader();
    console.error("Error sending OTP:", error);
    alert("An error occurred. Please try again.");
  });
}

// Function to verify OTP
function verifyOTP() {
  const otp = document.getElementById("otpInput").value;
  showLoader();
  // Send OTP verification request to the backend
  fetch('/verify_otp', {
    method: 'POST',
    body: new URLSearchParams({ 'phone_number': phoneNumber, 'otp': otp }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  .then(response => response.json())
  .then(data => {
    hideLoader();
    if (data.message) {
      alert("OTP verified successfully!");
      showSuccessAnimation();
      // Proceed with login or other actions
      Create_user(Username,phoneNumber)
      document.getElementById("signUpWrapper").innerHTML=`<h2 style="color: black; padding: 10px; font-weight:Bolder">Welcome ${Username}!</h2>`
      closeAll();
    } else {
      alert("Invalid OTP.");
    }
  })
  .catch(error => {
    hideLoader();
    console.error("Error verifying OTP:", error);
    alert("An error occurred. Please try again.");
  });
}

// Function to send user details and create a new user

function sendSignUpData() {
  Username = document.getElementById("name").value;
  phoneNumber = document.getElementById("NewPhone").value;
  // Validate input fields
  if (!Username || !phoneNumber) {
    alert("Please enter both your name and phone number.");
    console.log(Username)
    console.log(phoneNumber)
    return;
  }
  showLoader();
  fetch('/check_user_existence', {
    method: 'POST',
    body: new URLSearchParams({ 'phone_number': phoneNumber }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  .then(response => response.json())
  .then(data => {
    hideLoader();
    if (!data.exists) {
      // User exists, show OTP modal
      sendOTP(phoneNumber);
      
    } else {
      // User doesn't exist, redirect to signup page
      alert("Already existing member! Please log in");
      sendOTP(phoneNumber);
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
    hideLoader();
    if (data.message) {
      //alert(data.message);
      // Proceed to login or other actions
    } else {
      
    }
  })
  .catch(error => {
    hideLoader();
    console.error("Error creating user:", error);
    alert("An error occurred. Please try again.");
  });
}

function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function showSuccessAnimation() {
  const animation = document.getElementById("successAnimation");
  animation.style.display = "flex";

  setTimeout(() => {
    animation.style.display = "none";
  }, 2000); // Hide after 2 seconds
}

