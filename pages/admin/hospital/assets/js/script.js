const API_URL = "https://demo-api-skills.vercel.app/api/MentalWellness/hospitals";

// Register Facility
document.getElementById("registerFacilityForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("facilityName").value;
    const location = document.getElementById("facilityLocation").value;
    const contactInfo = document.getElementById("facilityContact").value;
    const type = document.getElementById("facilityType").value;

    if (!type) {
        document.getElementById("registerFacilityMessage").textContent = "❌ Please select a facility type!";
        document.getElementById("registerFacilityMessage").style.color = "red";
        return;
    }

    console.log("Submitting Facility:", { name, location, contactInfo, type });

    axios.post(API_URL, { name, location, contactInfo, type })
        .then(response => {
            console.log("Response:", response.data);
            document.getElementById("registerFacilityMessage").textContent = "✅ Facility registered successfully!";
            document.getElementById("registerFacilityMessage").style.color = "green";
            document.getElementById("registerFacilityForm").reset();
        })
        .catch(error => {
            console.error("Registration Error:", error.response ? error.response.data : error);
            document.getElementById("registerFacilityMessage").textContent = "❌ Registration failed!";
            document.getElementById("registerFacilityMessage").style.color = "red";
        });
});

// Fetch All Facilities
function fetchFacilities() {
    axios.get(API_URL)
        .then(response => {
            console.log("Fetched Facilities:", response.data);
            const facilities = response.data;
            const list = document.getElementById("facilitiesList");
            list.innerHTML = "";

            facilities.forEach(facility => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = `${facility.name} - ${facility.location} (${facility.type})`;
                list.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching facilities:", error));
}

// Search Facilities
function searchFacilities() {
    const location = document.getElementById("searchLocation").value;
    const type = document.getElementById("searchType").value;

    if (!location && !type) {
        alert("Please provide at least one search criterion (location or type).");
        return;
    }

    const searchAPI = "https://demo-api-skills.vercel.app/api/MentalWellness/hospitals/search";

    console.log("Searching for:", { location, type });

    axios.get(searchAPI, { params: { location, type } })
        .then(response => {
            console.log("Search Results:", response.data);
            const results = response.data;
            const list = document.getElementById("searchResults");
            list.innerHTML = "";

            if (results.length === 0) {
                list.innerHTML = "<li class='list-group-item text-danger'>No results found.</li>";
                return;
            }

            results.forEach(facility => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = `${facility.name} - ${facility.location} (${facility.type})`;
                list.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Search Error:", error.response ? error.response.data : error);
            document.getElementById("searchResults").innerHTML = "<li class='list-group-item text-danger'>❌ Search failed.</li>";
        });
}

function fetchFacilities() {
    axios.get(API_URL)
        .then(response => {
            console.log("Fetched Facilities:", response.data);
            const facilities = response.data;
            const list = document.getElementById("hospitalList");
            list.innerHTML = "";

            facilities.forEach(facility => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = `${facility.name} - ${facility.location} (${facility.type})`;
                list.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching facilities:", error));
}


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