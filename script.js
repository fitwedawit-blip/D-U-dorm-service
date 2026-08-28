// Persistent Local Storage Data
let defaultStudents = [
    { id: "RMSS-2831-/23", name: "ABEBE ALEMAYEHU KUTO", gender: "Male", department: "Teachers Education in History", block: "527", dorm: "17" },
    { id: "RMSS-0551-/23", name: "ABITI ZENEBE LEGESE", gender: "Male", department: "Teachers Education in History", block: "527", dorm: "17" },
    { id: "RMSS-9517-/23", name: "AGEGNEHU MIHIRET KASSAHUN", gender: "Male", department: "Teachers Education in History", block: "527", dorm: "17" },
    { id: "RMSS-1281-/23", name: "ALAZAR EYASU BOLKA", gender: "Male", department: "Teachers Education in History", block: "527", dorm: "18" }
];

let studentDatabase = JSON.parse(localStorage.getItem('du_students')) || defaultStudents;
let currentUserRole = null; // "admin" or "custom"

function saveDatabase() {
    localStorage.setItem('du_students', JSON.stringify(studentDatabase));
    renderTable();
}

// UI Elements
const searchModal = document.getElementById('searchModal');
const signInModal = document.getElementById('signInModal');
const accessChoiceModal = document.getElementById('accessChoiceModal');
const customCodeModal = document.getElementById('customCodeModal');
const studentListModal = document.getElementById('studentListModal');

const checkDormBtn = document.getElementById('checkDormBtn');
const headerSignInBtn = document.getElementById('headerSignInBtn');
const viewListBtn = document.getElementById('viewListBtn');

const choiceAdminBtn = document.getElementById('choiceAdminBtn');
const choiceCustomBtn = document.getElementById('choiceCustomBtn');

// Open Search Dorm Modal
checkDormBtn.addEventListener('click', () => searchModal.style.display = 'flex');

// Header Sign In (Direct Admin Login)
headerSignInBtn.addEventListener('click', () => {
    if (currentUserRole === 'admin') {
        openStudentList('admin');
    } else {
        signInModal.style.display = 'flex';
    }
});

// Click "Student List" -> Open Choice Modal (Admin OR Custom)
viewListBtn.addEventListener('click', () => {
    if (currentUserRole) {
        openStudentList(currentUserRole);
    } else {
        accessChoiceModal.style.display = 'flex';
    }
});

// Handle Choice: Admin Button
choiceAdminBtn.addEventListener('click', () => {
    accessChoiceModal.style.display = 'none';
    signInModal.style.display = 'flex';
});

// Handle Choice: Custom Button
choiceCustomBtn.addEventListener('click', () => {
    accessChoiceModal.style.display = 'none';
    customCodeModal.style.display = 'flex';
});

// Close Button Event Listeners
document.getElementById('closeSearchModal').onclick = () => searchModal.style.display = 'none';
document.getElementById('closeSignInModal').onclick = () => signInModal.style.display = 'none';
document.getElementById('closeChoiceModal').onclick = () => accessChoiceModal.style.display = 'none';
document.getElementById('closeCustomModal').onclick = () => customCodeModal.style.display = 'none';
document.getElementById('closeListModal').onclick = () => studentListModal.style.display = 'none';

// Admin Authentication (Username: DU4585 | Password: Dave0404)
document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginUsername').value;
    const pass = document.getElementById('loginPassword').value;

    if (user === "DU4585" && pass === "Dave0404") {
        currentUserRole = 'admin';
        alert("Administrator Login Successful!");
        
        signInModal.style.display = 'none';
        headerSignInBtn.textContent = "Admin Logged In";
        headerSignInBtn.style.backgroundColor = "#28a745";
        
        openStudentList('admin');
        document.getElementById('signInForm').reset();
    } else {
        alert("Invalid Admin Username or Password!");
    }
});

// Custom Code Access (Code: DUFH)
document.getElementById('customCodeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('customCodeInput').value.trim();

    if (code === "DUFH") {
        currentUserRole = 'custom';
        alert("Access Granted: Viewer Mode (Read-Only)");
        
        customCodeModal.style.display = 'none';
        openStudentList('custom');
        document.getElementById('customCodeForm').reset();
    } else {
        alert("Invalid Access Code! Please enter the correct code (DUFH).");
    }
});

// Display Student List Modal Based on Access Role
function openStudentList(role) {
    const badge = document.getElementById('accessBadge');
    const adminControls = document.getElementById('adminControls');

    renderTable();

    if (role === 'admin') {
        badge.textContent = "Administrator Mode (Full Access)";
        badge.style.backgroundColor = "#28a745";
        adminControls.classList.remove('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    } else {
        badge.textContent = "Viewer Mode (Read-Only)";
        badge.style.backgroundColor = "#6c757d";
        adminControls.classList.add('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
    }

    studentListModal.style.display = 'flex';
}

// Render Student Data Rows
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
            <td class="admin-only ${currentUserRole === 'admin' ? '' : 'hidden'}">
                <button class="btn btn-danger" onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Admin Operation: Add Student
document.getElementById('addStudentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentUserRole !== 'admin') return;
    
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
    alert("New student record added!");
});

// Admin Operation: Delete Student
function deleteStudent(index) {
    if (currentUserRole !== 'admin') return;
    if (confirm("Are you sure you want to remove this student record?")) {
        studentDatabase.splice(index, 1);
        saveDatabase();
    }
}

// Public Dormitory Search
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
        alert("Student ID not found.");
        resultCard.classList.add('hidden');
    }
});