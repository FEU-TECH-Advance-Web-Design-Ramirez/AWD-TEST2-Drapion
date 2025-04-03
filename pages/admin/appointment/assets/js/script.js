const API_URL = "https://demo-api-skills.vercel.app/api/MentalWellness/hospitals"; 
        let selectedHospitals = [];

        // Fetch hospitals from API and display them
        function fetchAndDisplayHospitals() {
            axios.get(API_URL)
                .then(response => {
                    displayHospitalsToPick(response.data);
                })
                .catch(error => {
                    console.error("Error fetching hospitals:", error);
                    document.getElementById("hospitalList").innerHTML = 
                        "<li class='list-group-item text-danger'>Failed to load hospitals.</li>";
                });
        }

        // Display hospitals to be selected
        function displayHospitalsToPick(hospitals) {
            const list = document.getElementById("hospitalList");
            list.innerHTML = "";

            hospitals.forEach((hospital, index) => {
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
            if (selectedHospitals.some(hospital => hospital.name === name && hospital.location === location)) {
                alert("❌ This hospital is already selected!");
                return;
            }

            selectedHospitals.push({ name, location, type });
            saveSelectedHospitals();
            alert("✅ Hospital selected for appointment!");
            displaySelectedHospitals();
            populateHospitalSelect();
        }

        // Save selected hospitals to localStorage
        function saveSelectedHospitals() {
            localStorage.setItem("selectedHospitals", JSON.stringify(selectedHospitals));
        }

        // Load selected hospitals from localStorage
        function loadSelectedHospitals() {
            const savedHospitals = localStorage.getItem("selectedHospitals");
            selectedHospitals = savedHospitals ? JSON.parse(savedHospitals) : [];
            displaySelectedHospitals();
            populateHospitalSelect();
        }

        // Display selected hospitals
        function displaySelectedHospitals() {
            const list = document.getElementById("selectedHospitalsList");
            list.innerHTML = "";

            selectedHospitals.forEach((hospital, index) => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    <span>${hospital.name} - ${hospital.location} (${hospital.type})</span>
                `;
                list.appendChild(li);
            });
        }

        // Delete selected hospital
        function deleteHospital(index) {
            if (!confirm("Are you sure you want to delete this appointment?")) return;

            selectedHospitals.splice(index, 1);
            saveSelectedHospitals();
            displaySelectedHospitals();
            populateHospitalSelect();
            alert("✅ Appointment deleted!");
        }

        // Populate the hospital select dropdown with selected hospitals
        function populateHospitalSelect() {
            const hospitalSelect = document.getElementById("hospitalSelect");
            hospitalSelect.innerHTML = "<option value=''>--Select Hospital--</option>";

            selectedHospitals.forEach((hospital, index) => {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = `${hospital.name} - ${hospital.location} (${hospital.type})`;
                hospitalSelect.appendChild(option);
            });
        }

        // Handle appointment booking
        document.getElementById("appointmentForm").addEventListener("submit", function(event) {
            event.preventDefault();

            const hospitalIndex = document.getElementById("hospitalSelect").value;
            const appointmentDate = document.getElementById("appointmentDate").value;
            const appointmentTime = document.getElementById("appointmentTime").value;

            if (hospitalIndex === "" || !appointmentDate || !appointmentTime) {
                alert("❌ Please fill all the fields!");
                return;
            }

            const selectedHospital = selectedHospitals[hospitalIndex];

            alert(`✅ Appointment booked with ${selectedHospital.name} at ${appointmentDate} ${appointmentTime}`);
        });

        // Initialize the page
        function initializePage() {
            fetchAndDisplayHospitals();
            loadSelectedHospitals();
        }

        // Run initialization on page load
        window.onload = initializePage;