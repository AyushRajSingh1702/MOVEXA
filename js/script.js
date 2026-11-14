
/* =====================================================
   MOVEXA WEBSITE - COMPLETE JAVASCRIPT
   Navbar | Login | Register | Booking | Dashboard
   Profile | Help | Contact | Admin
===================================================== */


/* ===================== 1. STORAGE KEYS ===================== */

const KEY_USERS = "movexa_users";
const KEY_BOOKINGS = "movexa_bookings";
const KEY_SUPPORT = "movexa_support";
const KEY_CURRENT = "movexa_current";


/* ===================== 2. LOCAL STORAGE ===================== */

function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}


function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


function currentUser() {
    return JSON.parse(localStorage.getItem(KEY_CURRENT) || "null");
}


function setCurrentUser(user) {
    localStorage.setItem(KEY_CURRENT, JSON.stringify(user));
}


/* ===================== 3. LOGOUT ===================== */

function logout() {
    localStorage.removeItem(KEY_CURRENT);
    location.href = "login.html";
}


/* ===================== 4. NAVIGATION BAR ===================== */

function nav() {

    const user = currentUser();
    const navbar = document.getElementById("navbar");

    // If navbar container exists, create complete navbar
    if (navbar) {

        navbar.innerHTML = `
            <nav class="navbar">

                <div class="nav-inner">

                    <a href="index.html" class="logo">
                        <img src="../images/logo.png" alt="MOVEXA Logo">
                        <span>MOVEXA</span>
                    </a>

                    <button class="menu-toggle"
                        id="menuToggle"
                        type="button"
                        aria-label="Toggle navigation"
                        aria-expanded="false">
                        ☰
                    </button>

                    <div class="nav-links" id="navLinks">

                        <a href="index.html">Home</a>

                        <a href="index.html#services">Services</a>

                        <a href="index.html#how-it-works">How It Works</a>

                        <a href="about.html">About</a>

                        <a href="contact.html">Contact</a>

                        <a href="help.html">Help</a>

                        <div id="authArea">

                            ${
                                user
                                ? `
                                    <a href="dashboard.html">Dashboard</a>

                                    <button
                                        class="btn btn-primary"
                                        type="button"
                                        onclick="logout()">
                                        Logout
                                    </button>
                                `
                                : `
                                    <a href="login.html" class="nav-login">
                                        Login
                                    </a>

                                    <a href="register.html" class="nav-register">
                                        Register
                                    </a>
                                `
                            }

                        </div>

                    </div>

                </div>

            </nav>
        `;

        // Highlight active page
        const currentPage = location.pathname.split("/").pop();

        navbar.querySelectorAll(".nav-links > a").forEach(link => {

            const linkPage = link.getAttribute("href").split("#")[0];

            if (
                linkPage === currentPage &&
                !link.getAttribute("href").includes("#")
            ) {
                link.classList.add("active");
            }

        });

        // Mobile navigation toggle
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.getElementById("navLinks");

        if (menuToggle && navLinks) {

            menuToggle.addEventListener("click", function () {

                const isOpen = navLinks.classList.toggle("show");

                menuToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

                menuToggle.textContent = isOpen ? "✕" : "☰";

            });

        }

    } else {

        // Support pages that already contain #authArea
        const authArea = document.getElementById("authArea");

        if (!authArea) return;

        if (user) {

            authArea.innerHTML = `
                <a href="dashboard.html">Dashboard</a>

                <button class="btn btn-primary"
                    type="button"
                    onclick="logout()">
                    Logout
                </button>
            `;

        } else {

            authArea.innerHTML = `
                <a href="login.html">Login</a>

                <a class="btn btn-primary" href="register.html">
                    Register
                </a>
            `;

        }

    }

}


/* ===================== 5. ALERT MESSAGE ===================== */


function showAlert(id, message, type = "success") {

    const oldPopup = document.getElementById("movexaPopup");

    if (oldPopup) oldPopup.remove();

    const success = type === "success";

    const overlay = document.createElement("div");

    overlay.id = "movexaPopup";

    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(5,25,38,0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        padding: 20px;
        backdrop-filter: blur(5px);
    `;

    overlay.innerHTML = `
        <div style="
            background: white;
            width: 100%;
            max-width: 420px;
            padding: 35px 25px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">

            <div style="
                width: 75px;
                height: 75px;
                background: ${success ? '#EAF8C9' : '#FEE2E2'};
                color: #0B3048;
                border-radius: 50%;
                display: grid;
                place-items: center;
                font-size: 40px;
                margin: 0 auto 20px;
            ">
                ${success ? '✓' : '✕'}
            </div>

            <h2 style="color:#0B3048; margin-bottom:12px;">
                ${success ? 'Booking Successful!' : 'Error!'}
            </h2>

            <p style="color:#71808A; margin-bottom:25px;">
                ${message}
            </p>

            <button id="popupOkay" style="
                width:100%;
                padding:14px;
                border:0;
                border-radius:10px;
                background:#B9F12F;
                color:#0B3048;
                font-weight:800;
                cursor:pointer;
            ">
                Okay, Got It
            </button>

        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("popupOkay").onclick = () => {
        overlay.remove();
    };

    overlay.onclick = (event) => {
        if (event.target === overlay) overlay.remove();
    };
}



/* ===================== 6. LOGIN REQUIRED ===================== */

function requireLogin() {

    if (!currentUser()) {

        location.href = "login.html";

        return false;

    }

    return true;

}


/* ===================== 7. REGISTER ===================== */

function initRegister() {

    const form = document.getElementById("registerForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const formData = new FormData(form);

        const name = formData.get("name").trim();
        const email = formData.get("email").trim().toLowerCase();
        const phone = formData.get("phone").trim();
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");


        if (password !== confirmPassword) {

            showAlert(
                "registerAlert",
                "Passwords do not match.",
                "error"
            );

            return;

        }


        const users = getData(KEY_USERS);


        if (users.some(user => user.email === email)) {

            showAlert(
                "registerAlert",
                "Email already registered.",
                "error"
            );

            return;

        }


        const user = {

            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            password: password

        };


        users.push(user);

        saveData(KEY_USERS, users);


        const safeUser = { ...user };

        delete safeUser.password;

        setCurrentUser(safeUser);


        showAlert(
            "registerAlert",
            "Registration successful. Redirecting..."
        );


        setTimeout(() => {

            location.href = "dashboard.html";

        }, 700);

    });

}


/* ===================== 8. LOGIN ===================== */

function initLogin() {

    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const formData = new FormData(form);

        const email = formData.get("email").trim().toLowerCase();

        const password = formData.get("password");


        // Admin Login
        if (
            email === "admin@movexa.com" &&
            password === "admin123"
        ) {

            setCurrentUser({

                name: "MOVEXA Admin",
                email: email,
                role: "admin"

            });

            location.href = "admin.html";

            return;

        }


        const users = getData(KEY_USERS);


        const user = users.find(
            user =>
                user.email === email &&
                user.password === password
        );


        if (!user) {

            showAlert(
                "loginAlert",
                "Invalid email or password.",
                "error"
            );

            return;

        }


        const safeUser = { ...user };

        delete safeUser.password;

        setCurrentUser(safeUser);

        location.href = "dashboard.html";

    });

}


/* ===================== 9. BOOKING ===================== */

function initBooking() {

    const form = document.getElementById("bookingForm");

    if (!form) return;

    if (!requireLogin()) return;


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const formData = new FormData(form);

        const user = currentUser();

        const bookings = getData(KEY_BOOKINGS);


        const booking = {

            id: "MX" + Date.now().toString().slice(-7),

            userId: user.id || user.email,

            userName: user.name,

            email: user.email,

            from: formData.get("from"),

            to: formData.get("to"),

            moveDate: formData.get("moveDate"),

            service: formData.get("service"),

            items: formData.get("items"),

            phone: formData.get("phone"),

            status: "Pending",

            createdAt: new Date().toLocaleString()

        };


        bookings.push(booking);

        saveData(KEY_BOOKINGS, bookings);


        showAlert(
            "bookingAlert",
            `Booking ${booking.id} created successfully!`
        );


        form.reset();

    });

}


/* ===================== 10. SHOW BOOKINGS ===================== */

function renderBookings() {

    const tbody = document.getElementById("bookingRows");

    if (!tbody) return;

    if (!requireLogin()) return;


    const user = currentUser();

    const bookings = getData(KEY_BOOKINGS);


    const userBookings = bookings.filter(
        booking =>
            booking.userId === (user.id || user.email)
    );


    if (userBookings.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="center muted">
                    No bookings yet.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML = userBookings.map(booking => {

        const statusClass = booking.status
            .toLowerCase()
            .replaceAll(" ", "");


        return `

            <tr>

                <td>${booking.id}</td>

                <td>${booking.from}</td>

                <td>${booking.to}</td>

                <td>${booking.moveDate}</td>

                <td>${booking.service}</td>

                <td>
                    <span class="badge ${statusClass}">
                        ${booking.status}
                    </span>
                </td>

                <td>

                    <button
                        class="btn btn-danger"
                        onclick="deleteBooking('${booking.id}')">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    }).join("");

}


/* ===================== 11. DELETE BOOKING ===================== */

function deleteBooking(id) {

    if (!confirm("Delete this booking?")) return;

    const user = currentUser();

    const bookings = getData(KEY_BOOKINGS);


    const updatedBookings = bookings.filter(
        booking =>
            !(
                booking.id === id &&
                booking.userId === (user.id || user.email)
            )
    );


    saveData(KEY_BOOKINGS, updatedBookings);

    renderBookings();

}


/* ===================== 12. PROFILE ===================== */

function initProfile() {

    const form = document.getElementById("profileForm");

    if (!form) return;

    if (!requireLogin()) return;


    const user = currentUser();

    const users = getData(KEY_USERS);


    const fullUser =
        users.find(item => item.id === user.id) || user;


    form.elements["name"].value = fullUser.name || "";

    form.elements["email"].value = fullUser.email || "";

    form.elements["phone"].value = fullUser.phone || "";


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const formData = new FormData(form);

        const newName = formData.get("name").trim();

        const phone = formData.get("phone").trim();


        const users = getData(KEY_USERS);


        const index =
            users.findIndex(item => item.id === user.id);


        if (index >= 0) {

            users[index].name = newName;

            users[index].phone = phone;

            saveData(KEY_USERS, users);

        }


        setCurrentUser({

            ...user,

            name: newName,

            phone: phone

        });


        showAlert(
            "profileAlert",
            "Profile updated successfully."
        );

    });

}


/* ===================== 13. DASHBOARD ===================== */

function renderDashboard() {

    const user = currentUser();

    if (!user || user.role === "admin") return;


    const bookings = getData(KEY_BOOKINGS);


    const userBookings = bookings.filter(
        booking =>
            booking.userId === (user.id || user.email)
    );


    const totalBookings =
        document.getElementById("totalBookings");


    if (totalBookings) {

        totalBookings.textContent = userBookings.length;

    }


    const userName =
        document.getElementById("userName");


    if (userName) {

        userName.textContent = user.name;

    }


    const lastBooking =
        document.getElementById("lastBooking");


    if (lastBooking) {

        if (userBookings.length > 0) {

            const latest =
                userBookings[userBookings.length - 1];


            lastBooking.textContent =
                `Latest Booking: ${latest.id} | ${latest.status}`;

        } else {

            lastBooking.textContent =
                "No booking created yet.";

        }

    }

}


/* ===================== 14. HELP FORM ===================== */

function initHelp() {

    const form = document.getElementById("helpForm");

    if (!form) return;


    const user = currentUser();


    if (user) {

        if (form.elements["name"]) {

            form.elements["name"].value = user.name || "";

        }

        if (form.elements["email"]) {

            form.elements["email"].value = user.email || "";

        }

    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const formData = new FormData(form);

        const messages = getData(KEY_SUPPORT);


        messages.push({

            id: Date.now(),

            name: formData.get("name"),

            email: formData.get("email"),

            issue: formData.get("issue"),

            message: formData.get("message"),

            status: "New",

            date: new Date().toLocaleString()

        });


        saveData(KEY_SUPPORT, messages);


        showAlert(
            "helpAlert",
            "Your message has been submitted successfully."
        );


        form.reset();

    });

}


/* ===================== 15. CONTACT FORM ===================== */

function initContact() {

    const form = document.getElementById("contactForm");

    if (!form) return;


    const user = currentUser();


    // Auto-fill details for logged-in users
    if (user) {

        if (form.elements["name"]) {
            form.elements["name"].value = user.name || "";
        }

        if (form.elements["email"]) {
            form.elements["email"].value = user.email || "";
        }

        if (form.elements["phone"]) {
            form.elements["phone"].value = user.phone || "";
        }

    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const formData = new FormData(form);

        const messages = getData(KEY_SUPPORT);


        const contactMessage = {

            id: Date.now(),

            name: formData.get("name"),

            email: formData.get("email"),

            phone: formData.get("phone"),

            issue: formData.get("subject"),

            message: formData.get("message"),

            status: "New",

            date: new Date().toLocaleString(),

            source: "Contact Page"

        };


        messages.push(contactMessage);

        saveData(KEY_SUPPORT, messages);


        showAlert(
            "contactAlert",
            "Thank you! Your message has been submitted successfully."
        );


        form.reset();

    });

}


/* ===================== 16. ADMIN DASHBOARD ===================== */

function adminRender() {

    const user = currentUser();


    if (!user || user.role !== "admin") {

        location.href = "login.html";

        return;

    }


    const bookings = getData(KEY_BOOKINGS);

    const users = getData(KEY_USERS);

    const messages = getData(KEY_SUPPORT);


    const adminUsers = document.getElementById("adminUsers");

    const adminBookings = document.getElementById("adminBookings");

    const adminPending = document.getElementById("adminPending");

    const adminCompleted = document.getElementById("adminCompleted");


    if (adminUsers) adminUsers.textContent = users.length;

    if (adminBookings) adminBookings.textContent = bookings.length;

    if (adminPending) {

        adminPending.textContent = bookings.filter(
            booking => booking.status !== "Completed"
        ).length;

    }

    if (adminCompleted) {

        adminCompleted.textContent = bookings.filter(
            booking => booking.status === "Completed"
        ).length;

    }


    /* ADMIN BOOKING TABLE */

    const bookingRows =
        document.getElementById("adminBookingRows");


    if (bookingRows) {

        if (bookings.length === 0) {

            bookingRows.innerHTML = `
                <tr>
                    <td colspan="7" class="center muted">
                        No bookings.
                    </td>
                </tr>
            `;

        } else {

            bookingRows.innerHTML = bookings.map(booking => `

                <tr>

                    <td>${booking.id}</td>

                    <td>${booking.userName}</td>

                    <td>${booking.from}</td>

                    <td>${booking.to}</td>

                    <td>${booking.moveDate}</td>

                    <td>

                        <select
                            onchange="updateStatus(
                                '${booking.id}',
                                this.value
                            )">

                            ${[
                                "Pending",
                                "Confirmed",
                                "Assigned",
                                "In Transit",
                                "Completed"
                            ].map(status => `

                                <option
                                    value="${status}"
                                    ${status === booking.status ? "selected" : ""}>

                                    ${status}

                                </option>

                            `).join("")}

                        </select>

                    </td>

                    <td>

                        <button
                            class="btn btn-danger"
                            onclick="adminDeleteBooking('${booking.id}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `).join("");

        }

    }


    /* ADMIN SUPPORT TABLE */

    const supportRows =
        document.getElementById("supportRows");


    if (supportRows) {

        if (messages.length === 0) {

            supportRows.innerHTML = `
                <tr>
                    <td colspan="5" class="center muted">
                        No support messages.
                    </td>
                </tr>
            `;

        } else {

            supportRows.innerHTML = messages.map(message => `

                <tr>

                    <td>
                        ${message.name}
                        <br>
                        <small>${message.email}</small>
                    </td>

                    <td>${message.issue || "General Enquiry"}</td>

                    <td>${message.message}</td>

                    <td>

                        <span class="badge ${
                            message.status === "Resolved"
                                ? "resolved"
                                : "new"
                        }">

                            ${message.status}

                        </span>

                    </td>

                    <td>

                        <button
                            class="btn btn-success"
                            onclick="resolveSupport(${message.id})">

                            Resolve

                        </button>

                    </td>

                </tr>

            `).join("");

        }

    }

}


/* ===================== 17. UPDATE BOOKING STATUS ===================== */

function updateStatus(id, status) {

    const bookings = getData(KEY_BOOKINGS);


    const index =
        bookings.findIndex(booking => booking.id === id);


    if (index >= 0) {

        bookings[index].status = status;

        saveData(KEY_BOOKINGS, bookings);

        adminRender();

    }

}


/* ===================== 18. ADMIN DELETE BOOKING ===================== */

function adminDeleteBooking(id) {

    if (!confirm("Delete this booking?")) return;


    const bookings = getData(KEY_BOOKINGS);


    saveData(
        KEY_BOOKINGS,
        bookings.filter(booking => booking.id !== id)
    );


    adminRender();

}


/* ===================== 19. RESOLVE SUPPORT ===================== */

function resolveSupport(id) {

    const messages = getData(KEY_SUPPORT);


    const index =
        messages.findIndex(message => message.id === id);


    if (index >= 0) {

        messages[index].status = "Resolved";

        saveData(KEY_SUPPORT, messages);

        adminRender();

    }

}


/* ===================== 20. PAGE LOAD ===================== */

document.addEventListener("DOMContentLoaded", function () {

    // Navigation
    nav();


    // Authentication
    initRegister();

    initLogin();


    // Booking
    initBooking();

    renderBookings();


    // User profile and dashboard
    initProfile();

    renderDashboard();


    // Support and contact
    initHelp();

    initContact();


    // Admin dashboard
    if (document.getElementById("adminBookingRows")) {

        adminRender();

    }

});


/* ===================== END OF MOVEXA JAVASCRIPT ===================== */
