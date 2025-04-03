const API_URL = "https://demo-api-skills.vercel.app/api/MentalWellness/hospitals";

// Stores selected hospitals locally
let selectedHospitals = [];
let allHospitals = []; // To store the fetched hospitals

// Fetch all hospitals and allow user to pick which ones to display in appointment list
function fetchHospitals() {
    axios.get(API_URL)
        .then(function (response) {
            allHospitals = response.data; // Store all hospitals
            displayHospitalsToPick(allHospitals); // Display all hospitals initially
        })
        .catch(function (error) {
            console.error("Error fetching hospitals:", error);
        });
}
// Register a new hospital or clinic
function registerHospital(event) {
    event.preventDefault(); // Prevent form submission

    // Get form input values
    const name = document.getElementById("facilityName").value;
    const location = document.getElementById("facilityLocation").value;
    const contact = document.getElementById("facilityContact").value;
    const type = document.getElementById("facilityType").value;

    // Validate input fields
    if (!name || !location || !contact || !type) {
        document.getElementById("registerFacilityMessage").textContent = "❌ All fields are required!";
        return;
    }

    const newFacility = {
        name: name,
        location: location,
        contact: contact,
        type: type
    };

    // Send a POST request to register the new facility
    axios.post(API_URL, newFacility)
        .then(function (response) {
            document.getElementById("registerFacilityMessage").textContent = "✅ Hospital/Clinic registered successfully!";
            fetchHospitals(); // Fetch the updated list of hospitals
        })
        .catch(function (error) {
            console.error("Error registering hospital:", error);
            document.getElementById("registerFacilityMessage").textContent = "❌ Failed to register the facility!";
        });
}

// Search hospitals based on location and type
function searchFacilities() {
    const location = document.getElementById("searchLocation").value.toLowerCase();
    const type = document.getElementById("searchType").value;

    // Filter hospitals based on search criteria
    const filteredHospitals = allHospitals.filter(function (hospital) {
        const matchesLocation = hospital.location.toLowerCase().includes(location);
        const matchesType = type ? hospital.type === type : true;
        return matchesLocation && matchesType;
    });

    // Display the filtered hospitals
    displayHospitalsToPick(filteredHospitals);
}

// Add event listener to form submission
document.getElementById("registerFacilityForm").addEventListener("submit", registerHospital);

// Display hospitals to be selected for the appointment list
function displayHospitalsToPick(hospitals) {
    const list = document.getElementById("hospitalList");
    list.innerHTML = ""; // Clear the list before rendering

    hospitals.forEach(function (hospital, index) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <span>${hospital.name} - ${hospital.location} (${hospital.type})</span>
            <button class="btn btn-success btn-sm" onclick="selectHospital(${index}, '${hospital.name}', '${hospital.location}', '${hospital.type}')">Select</button>
        `;
        list.appendChild(li);
    });
}

// Select a hospital and store it in localStorage
function selectHospital(index, name, location, type) {
    // Check if hospital is already selected
    if (selectedHospitals.some(hospital => hospital.name === name && hospital.location === location)) {
        alert("❌ This hospital is already selected!");
        return;
    }

    // Add selected hospital to the local array
    selectedHospitals.push({ name, location, type });

    // Save the selected hospitals to localStorage
    saveSelectedHospitals();

    alert("✅ Hospital selected for appointment!");
    displaySelectedHospitals();
}

// Save selected hospitals to localStorage
function saveSelectedHospitals() {
    localStorage.setItem('selectedHospitals', JSON.stringify(selectedHospitals));
}

// Load selected hospitals from localStorage
function loadSelectedHospitals() {
    const savedHospitals = localStorage.getItem('selectedHospitals');
    if (savedHospitals) {
        selectedHospitals = JSON.parse(savedHospitals);
        displaySelectedHospitals();
    }
}

// Display selected hospitals in the appointment list
function displaySelectedHospitals() {
    const list = document.getElementById("selectedHospitalsList");
    list.innerHTML = ""; // Clear the list before rendering

    selectedHospitals.forEach(function (hospital, index) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <span>${hospital.name} - ${hospital.location} (${hospital.type})</span>
            <button class="btn btn-warning btn-sm" onclick="editHospital(${index})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteHospital(${index})">Delete</button>
        `;
        list.appendChild(li);
    });
}

// Edit hospital details
function editHospital(index) {
    const hospital = selectedHospitals[index];
    const newName = prompt("Enter new name:", hospital.name);
    const newLocation = prompt("Enter new location:", hospital.location);
    const newType = prompt("Enter new type (Hospital/Clinic):", hospital.type);

    if (newName && newLocation && newType) {
        selectedHospitals[index] = { name: newName, location: newLocation, type: newType };
        saveSelectedHospitals();
        displaySelectedHospitals();
        alert("✅ Hospital details updated!");
    } else {
        alert("❌ All fields must be filled!");
    }
}

// Delete selected hospital
function deleteHospital(index) {
    if (!confirm("Are you sure you want to delete this hospital?")) return;

    selectedHospitals.splice(index, 1); // Remove hospital from the array
    saveSelectedHospitals();
    displaySelectedHospitals();
    alert("✅ Hospital deleted from appointment list!");
}

// Call this on page load to load the selected hospitals and display them
loadSelectedHospitals();

// Fetch the hospitals when the page loads
fetchHospitals();
