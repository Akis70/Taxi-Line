// 1. Ρυθμίσεις Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCCzXoeqv3VODlSH6j3HrqI36ixYYdEjjI",
    authDomain: "taxi-line-f149e.firebaseapp.com",
    databaseURL: "https://taxi-line-f149e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "taxi-line-f149e",
    storageBucket: "taxi-line-f149e.firebasestorage.app",
    messagingSenderId: "1086896421565",
    appId: "1:1086896421565:web:e498b8916fd95a04e7d5d4"
};

// 2. Αρχικοποίηση
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const database = firebase.database();

let captchaResult = 0;
let isRegisterMode = false;

// 3. Συνάρτηση Captcha
function generateCaptcha() {
    console.log("Generating Captcha...");
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    captchaResult = a + b;
    
    const qElement = document.getElementById('captcha-question');
    if (qElement) {
        qElement.innerText = `Επιβεβαίωση: Πόσο κάνει ${a} + ${b} ?`;
    }
}

// 4. Εναλλαγή Login/Register
function toggleMode() {
    isRegisterMode = !isRegisterMode;
    const title = document.getElementById('auth-title');
    if (title) title.innerText = isRegisterMode ? "Εγγραφή Νέου Χρήστη" : "Σύνδεση";
}

// 5. Κύρια Συνάρτηση Αυθεντικοποίησης
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
        // ΕΓΓΡΑΦΗ
        auth.createUserWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                return userCredential.user.sendEmailVerification().then(() => {
                    alert("Επιτυχία! Ελέγξτε το email σας για επιβεβαίωση.");
                    auth.signOut();
                    location.reload();
                });
            })
            .catch((error) => {
                alert("Σφάλμα εγγραφής: " + error.message);
            });
    } else {
        // ΣΥΝΔΕΣΗ
        auth.signInWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                if (userCredential.user.emailVerified) {
                    window.location.href = "dashboard.html";
                } else {
                    alert("Πρέπει πρώτα να επιβεβαιώσετε το email σας!");
                    auth.signOut();
                }
            })
            .catch((error) => {
                alert("Σφάλμα σύνδεσης: " + error.message);
            });
    }
}

// 6. Σύνδεση με Google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            alert("Σφάλμα Google: " + error.message);
        });
}

// 7. Εκτέλεση μόλις φορτώσει το περιεχόμενο
document.addEventListener('DOMContentLoaded', () => {
    generateCaptcha();
});
