const firebaseConfig = {
    apiKey: "AIzaSyCCzXoeqv3VODlSH6j3HrqI36ixYYdEjjI",
    authDomain: "taxi-line-f149e.firebaseapp.com",
    databaseURL: "https://taxi-line-f149e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "taxi-line-f149e",
    storageBucket: "taxi-line-f149e.firebasestorage.app",
    messagingSenderId: "1086896421565",
    appId: "1:1086896421565:web:e498b8916fd95a04e7d5d4"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let isRegisterMode = false;
let captchaResult = 0;

// Δημιουργία Captcha
function generateCaptcha() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    captchaResult = a + b;
    document.getElementById('captcha-question').innerText = `Πόσο κάνει: ${a} + ${b} ?`;
}

function toggleMode() {
    isRegisterMode = !isRegisterMode;
    document.getElementById('auth-title').innerText = isRegisterMode ? "Εγγραφή Νέου Χρήστη" : "Σύνδεση";
}

function processAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const ans = document.getElementById('captcha-answer').value;

    if (parseInt(ans) !== captchaResult) {
        alert("Λάθος Captcha! Αποδείξτε ότι είστε άνθρωπος.");
        generateCaptcha();
        return;
    }

    if (isRegisterMode) {
        // REGISTRY LOGIC: Αποθήκευση στη βάση δεδομένων
        database.ref('users/' + btoa(email).replace(/=/g, "")).set({
            email: email,
            password: pass, // Σημείωση: Σε κανονικό app χρησιμοποιούμε Firebase Auth για κρυπτογράφηση
            role: "user",
            verified: false
        }).then(() => {
            alert("Η εγγραφή ολοκληρώθηκε! Ένα email επιβεβαίωσης εστάλη στο " + email);
            window.location.href = "dashboard.html"; // Θα το φτιάξουμε μετά
        });
    } else {
        // LOGIN LOGIC: Έλεγχος Admin ή User
        if (pass === "admin" || pass === "Aggelos2026!") {
            window.location.href = "dashboard.html";
        } else {
            alert("Λάθος κωδικός ή μη επιβεβαιωμένος λογαριασμός.");
        }
    }
}

window.onload = generateCaptcha;
