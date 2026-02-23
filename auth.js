// Αρχικοποίηση Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCCzXoeqv3VODlSH6j3HrqI36ixYYdEjjI",
    authDomain: "taxi-line-f149e.firebaseapp.com",
    databaseURL: "https://taxi-line-f149e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "taxi-line-f149e",
    storageBucket: "taxi-line-f149e.firebasestorage.app",
    messagingSenderId: "1086896421565",
    appId: "1:1086896421565:web:e498b8916fd95a04e7d5d4"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const database = firebase.database();

let captchaResult = 0;
let isRegisterMode = false;

// Συνάρτηση για το Captcha
function generateCaptcha() {
    console.log("Προσπάθεια δημιουργίας Captcha...");
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    captchaResult = a + b;
    
    const qElement = document.getElementById('captcha-question');
    if (qElement) {
        qElement.innerText = `Επιβεβαίωση: Πόσο κάνει ${a} + ${b} ?`;
        console.log("Το Captcha δημιουργήθηκε με επιτυχία!");
    } else {
        console.error("Σφάλμα: Το στοιχείο 'captcha-question' δεν βρέθηκε στο HTML.");
    }
}

// Εναλλαγή Login/Register
function toggleMode() {
    isRegisterMode = !isRegisterMode;
    const title = document.getElementById('auth-title');
    if (title) title.innerText = isRegisterMode ? "Εγγραφή Νέου Χρήστη" : "Σύνδεση";
}

// Η κύρια συνάρτηση Auth (με Email Verification)
function processAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const ans = document.getElementById('captcha-answer').value;

    if (parseInt(ans) !== captchaResult) {
        alert("Λάθος Captcha! Προσπαθήστε ξανά.");
        generateCaptcha();
        return;
    }

    if (isRegisterMode) {
        auth.createUserWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                return userCredential.user.sendEmailVerification().then(() => {
                    alert("Επιτυχία! Ελέγξτε το email σας για επιβεβαίωση.");
                    auth.signOut();
                    location.reload();
                });
            })
            .catch(error => alert("Σφάλμα: " + error.message));
    } else {
        auth.signInWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                if (userCredential.user.emailVerified) {
                    window.location.href = "dashboard.html";
                } else {
                    alert("Πρέπει πρώτα να επιβεβαιώσετε το email σας!");
                    auth.signOut();
                }
            })
            .catch(error => alert("Σφάλμα: " + error.message));
    }
}

// Εκτέλεση μόλις φορτώσει το DOM
document.addEventListener('DOMContentLoaded', generateCaptcha);
