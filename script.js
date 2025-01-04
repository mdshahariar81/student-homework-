// Function to toggle between login and signup forms
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

// Function to handle user signup
function signupUser() {
    const fullName = document.getElementById('signup-full-name').value;
    const userId = document.getElementById('signup-user-id').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.userId === userId)) {
        alert('User ID already exists!');
        return false;
    }

    users.push({ fullName, userId, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please login.');
    toggleForms();
    return false;
}

// Function to handle user login
function loginUser() {
    const userId = document.getElementById('login-user-id').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.userId === userId && user.password === password);

    if (!user && (userId !== 'Admin123' || password !== 'Admin123')) {
        alert('Invalid User ID or Password!');
        return false;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user || { userId: 'Admin123', fullName: 'Admin' }));
    window.location.href = 'dashboard.html';
    return false;
}

// Function to handle logout
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Function to handle file upload
function uploadHomework() {
    const fileInput = document.getElementById('homework-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file!');
        return false;
    }

    const allowedExtensions = /(\.pdf|\.doc|\.docx|\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(file.name)) {
        alert('Invalid file type!');
        return false;
    }

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];

    const submission = {
        userId: loggedInUser.userId,
        fullName: loggedInUser.fullName,
        fileName: file.name,
        fileType: file.type,
        dateTime: new Date().toLocaleString()
    };

    submissions.push(submission);
    localStorage.setItem('submissions', JSON.stringify(submissions));
    alert('File uploaded successfully!');
    fileInput.value = '';
    displaySubmissions();
    return false;
}

// Function to display homework submissions on the dashboard
function displaySubmissions() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];

    const studentTableBody = document.getElementById('student-table').getElementsByTagName('tbody')[0];
    const adminTableBody = document.getElementById('admin-table').getElementsByTagName('tbody')[0];

    studentTableBody.innerHTML = '';
    adminTableBody.innerHTML = '';

    submissions.forEach(submission => {
        if (submission.userId === loggedInUser.userId) {
            const row = studentTableBody.insertRow();
            row.insertCell(0).innerText = submission.fileName;
            row.insertCell(1).innerText = submission.fileType;
            row.insertCell(2).innerText = submission.dateTime;
            row.insertCell(3).innerHTML = `<a href="#">Download</a>`;
        }

        if (loggedInUser.userId === 'Admin123') {
            const row = adminTableBody.insertRow();
            row.insertCell(0).innerText = submission.fullName;
            row.insertCell(1).innerText = submission.userId;
            row.insertCell(2).innerText = submission.fileName;
            row.insertCell(3).innerText = submission.fileType;
            row.insertCell(4).innerText = submission.dateTime;
            row.insertCell(5).innerHTML = `<a href="#">Download</a>`;
        }
    });
}

// Function to initialize the dashboard
function initDashboard() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('welcome-message').innerText = `Welcome, ${loggedInUser.fullName}`;

    if (loggedInUser.userId === 'Admin123') {
        document.getElementById('admin-dashboard').style.display = 'block';
    } else {
        document.getElementById('student-dashboard').style.display = 'block';
    }

    displaySubmissions();
}

// Initialize the dashboard when the dashboard page is loaded
if (window.location.pathname.endsWith('dashboard.html')) {
    window.onload = initDashboard;
}