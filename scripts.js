document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
  });
  
  let medications = [];
  
  function showRegister() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("register-container").style.display = "block";
  }
  
  function showLogin() {
    document.getElementById("register-container").style.display = "none";
    document.getElementById("login-container").style.display = "block";
  }
  
  function register() {
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;
  
    if (localStorage.getItem(username)) {
      alert("Username already exists!");
      return;
    }
  
    localStorage.setItem(username, btoa(password));
    alert("Registration successful!");
    showLogin();
  }
  
  function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const stored = localStorage.getItem(username);
    if (stored && atob(stored) === password) {
      localStorage.setItem("user", username);
      checkLogin();
    } else {
      alert("Invalid credentials");
    }
  }
  
  function logout() {
    localStorage.removeItem("user");
    window.location.reload();
  }
  
  function checkLogin() {
    const user = localStorage.getItem("user");
    if (user) {
      document.getElementById("login-container").style.display = "none";
      document.getElementById("register-container").style.display = "none";
      document.getElementById("app-container").style.display = "block";
      loadMedications();
    }
  }
  
  function loadMedications() {
    const user = localStorage.getItem("user");
    const stored = localStorage.getItem(`medications_${user}`);
    medications = stored ? JSON.parse(stored) : [];
    displayMedications();
  }
  
  function addMedication() {
    const name = document.getElementById("medicationName").value;
    const dosage = document.getElementById("dosage").value;
    const frequency = document.getElementById("frequency").value;
    const startDate = document.getElementById("startDate").value;
    const notes = document.getElementById("notes").value;
    const status = document.getElementById("status").value;
  
    if (!name || !dosage || !frequency || !startDate) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const med = {
      id: Date.now(),
      name,
      dosage,
      frequency,
      startDate,
      notes,
      status
    };
  
    medications.push(med);
    saveAndDisplay();
  }
  
  function saveAndDisplay() {
    const user = localStorage.getItem("user");
    localStorage.setItem(`medications_${user}`, JSON.stringify(medications));
    displayMedications();
  }
  
  function displayMedications(filterStatus = "all") {
    const list = document.getElementById("medicationList");
    const summary = document.getElementById("summary-count");
    list.innerHTML = "";
    let activeCount = 0;
  
    medications
      .filter(m => filterStatus === "all" || m.status === filterStatus)
      .forEach(med => {
        list.innerHTML += `
          <div class="medication-card">
            <strong>${med.name}</strong> (${med.dosage})<br>
            Frequency: ${med.frequency}<br>
            Start Date: ${med.startDate}<br>
            Notes: ${med.notes || 'None'}<br>
            <em>Status: ${med.status}</em>
            <button class="delete-btn" onclick="deleteMedication(${med.id})">Delete</button>
          </div>
        `;
        if (med.status === "Active") activeCount++;
      });
  
    summary.textContent = activeCount;
  }
  
  function deleteMedication(id) {
    medications = medications.filter(m => m.id !== id);
    saveAndDisplay();
  }
  
  function filterMedications() {
    const filter = document.getElementById("filterStatus").value;
    displayMedications(filter);
  }
  