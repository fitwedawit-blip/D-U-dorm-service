// Initial dataset stored in browser localStorage for persistent edits
let defaultStudents = [
    { id: "RMSS-2831-/23", name: "ABEBE ALEMAYEHU KUTO", gender: "Male", department: "Teachers Education in History", block: "527", dorm: "17" },
    { id: "RMSS-0551-/23", name: "ABITI ZENEBE LEGESE", gender: "Male", department: "Teachers Education in History", block: "527", dorm: "17" },
    { id: "RMSS-9517-/23", name: "AGEGNEHU MIHIRET KASSAHUN", gender: "Male", department: "Teachers Education in History", block: "527", dorm: "17" },
    { id: "RMSS-1281-/23", name: "ALAZAR EYASU BOLKA", gender: "Male", department: "Teachers Education in History", block: "527", dorm: "18" }
];

let studentDatabase = JSON.parse(localStorage.getItem('du_students')) || defaultStudents;
let isAdminLoggedIn = false;

function saveDatabase() {
    localStorage.setItem('du_students', JSON.stringify(studentDatabase));
    renderTable();
}

// UI Elements
const searchModal = document.getElementById('searchModal');
const signInModal = document.getElementById('signInModal');
const studentListModal = document.getElementById('studentListModal');

const checkDormBtn = document.getElementById('checkDormBtn');
const headerSignInBtn = document.getElementById('headerSignInBtn');
const viewListBtn = document.getElementById('viewListBtn');

// Open Modals
checkDormBtn.addEventListener('click', () => searchModal.style.display = 'flex');

// Header Sign In click action
headerSignInBtn.addEventListener('click', () => {
    if (isAdminLoggedIn) {
        // If already logged in, show student list directly
        renderTable();
        studentListModal.style.display = 'flex';
    } else {
        signInModal.style.display = 'flex';
    }
});

// Locked Student List button action
viewListBtn.addEventListener('click', () => {
    if (isAdminLoggedIn) {
        renderTable();
        studentListModal.style.display = 'flex';
    } else {
        alert("Access Restricted: Please sign in as an Administrator first.");
        signInModal.style.display = 'flex';
    }
});

// Close Modal Controls
document.getElementById('closeSearchModal').onclick = () => searchModal.style.display = 'none';
document.getElementById('closeSignInModal').onclick = () => signInModal.style.display = 'none';
document.getElementById('closeListModal').onclick = () => studentListModal.style.display = 'none';

// Populate Student Table Data
function renderTable() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';

    studentDatabase.forEach((student, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.department}</td>
            <td>${student.block}</td>
            <td>${student.dorm}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteStudent(${index})">Remove</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Authentication Check (Username: DU4585 | Password: Dave0404)
document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginUsername').value;
    const pass = document.getElementById('loginPassword').value;

    if (user === "DU4585" && pass === "Dave0404") {
        isAdminLoggedIn = true;
        alert("Administrator Login Successful! Access Granted to Student List.");
        
        // Update Header Button Status
        headerSignInBtn.textContent = "Dashboard (Logged In)";
        headerSignInBtn.style.backgroundColor = "#28a745";
        
        // Hide Login Modal & Instantly Show Student List Modal
        signInModal.style.display = 'none';
        renderTable();
        studentListModal.style.display = 'flex';
        
        // Clear login form
        document.getElementById('signInForm').reset();
    } else {
        alert("Invalid Username or Password! Access Denied.");
    }
});

// Admin Function: Add New Student
document.getElementById('addStudentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newStudent = {
        id: document.getElementById('newId').value.trim(),
        name: document.getElementById('newName').value.trim(),
        gender: document.getElementById('newGender').value,
        department: document.getElementById('newDept').value.trim(),
        block: document.getElementById('newBlock').value.trim(),
        dorm: document.getElementById('newDorm').value.trim()
    };

    studentDatabase.push(newStudent);
    saveDatabase();
    document.getElementById('addStudentForm').reset();
    alert("New student record added successfully!");
});

// Admin Function: Delete Student
function deleteStudent(index) {
    if (confirm("Are you sure you want to remove this student record?")) {
        studentDatabase.splice(index, 1);
        saveDatabase();
    }
}

// Student Public Search Handler
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredId = document.getElementById('studentId').value.trim().toUpperCase();
    const student = studentDatabase.find(s => s.id.toUpperCase() === enteredId);
    const resultCard = document.getElementById('resultCard');

    if (student) {
        document.getElementById('resName').textContent = student.name;
        document.getElementById('resId').textContent = student.id;
        document.getElementById('resGender').textContent = student.gender;
        document.getElementById('resDept').textContent = student.department;
        document.getElementById('resBlock').textContent = student.block;
        document.getElementById('resDorm').textContent = student.dorm;
        resultCard.classList.remove('hidden');
    } else {
        alert("Student ID not found in database.");
        resultCard.classList.add('hidden');
    }
});
