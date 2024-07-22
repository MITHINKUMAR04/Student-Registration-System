document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('student-form');
    const nameInput = document.getElementById('student-name');
    const addressInput = document.getElementById('address');
    const emailInput = document.getElementById('email');
    const contactInput = document.getElementById('contact');
    const tbody = document.querySelector('#student-records tbody');

    // Load students from localStorage, or initialize as an empty array if none exist
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Function to save the current students array to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Function to render students in the table
    function renderStudents() {
        tbody.innerHTML = ''; // Clear the existing table rows
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.address}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Function to add a new student
    function addStudent(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        const name = nameInput.value.trim();
        const address = addressInput.value.trim();
        const email = emailInput.value.trim();
        const contact = contactInput.value.trim();

        // Basic validation for required fields
        if (!name || !address || !email || !contact) {
            alert('All fields are required.');
            return;
        }

        // Validate contact number to ensure it contains only numbers
        if (!/^\d+$/.test(contact)) {
            alert('Contact No must be numbers.');
            return;
        }

        // Validate student name to ensure it contains only letters and spaces
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            alert('Student name must contain only letters and spaces.');
            return;
        }

        // Validate email address format
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Invalid email address.');
            return;
        }

        // Add the new student to the array
        students.push({ name, address, email, contact });
        saveToLocalStorage(); // Save updated students array to localStorage
        renderStudents(); // Re-render the students table

        form.reset(); // Clear the form inputs
    }

    // Function to edit an existing student
    function editStudent(index) {
        const student = students[index];
        // Populate the form with the student's current details
        nameInput.value = student.name;
        addressInput.value = student.address;
        emailInput.value = student.email;
        contactInput.value = student.contact;

        // Remove the existing submit event listener and add a new one for updating the student
        form.removeEventListener('submit', addStudent);
        form.addEventListener('submit', function updateStudent(event) {
            event.preventDefault(); // Prevent the form from submitting normally

            // Update the student details in the array
            students[index] = {
                name: nameInput.value.trim(),
                address: addressInput.value.trim(),
                email: emailInput.value.trim(),
                contact: contactInput.value.trim()
            };

            saveToLocalStorage(); // Save updated students array to localStorage
            renderStudents(); // Re-render the students table

            form.reset(); // Clear the form inputs
            // Restore the original add student event listener
            form.removeEventListener('submit', updateStudent);
            form.addEventListener('submit', addStudent);
        });
    }

    // Function to delete a student
    function deleteStudent(index) {
        students.splice(index, 1); // Remove the student from the array
        saveToLocalStorage(); // Save updated students array to localStorage
        renderStudents(); // Re-render the students table
    }

    // Event listener for form submission to add a new student
    form.addEventListener('submit', addStudent);

    // Event delegation to handle edit and delete button clicks
    tbody.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            editStudent(event.target.dataset.index); // Edit the selected student
        }

        if (event.target.classList.contains('delete-btn')) {
            deleteStudent(event.target.dataset.index); // Delete the selected student
        }
    });

    // Initial render of the students table
    renderStudents();
});
