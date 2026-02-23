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
    
    const qElement = document.getElementById('captcha-question');
    if (qElement) {
        qElement.innerText = `Επιβεβαίωση: Πόσο κάνει ${a} + ${b} ?`;
        console.log("Captcha generated: " + captchaResult);
    }
}

// Χρήση DOMContentLoaded αντί για window.onload
document.addEventListener('DOMContentLoaded', () => {
    generateCaptcha();
});

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
    // 1. Δημιουργία χρήστη στο Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            // 2. Αποστολή του Email Επιβεβαίωσης
            return userCredential.user.sendEmailVerification().then(() => {
                // 3. Αποθήκευση επιπλέον στοιχείων στη Realtime Database
                return database.ref('users/' + btoa(email).replace(/=/g, "")).set({
                    email: email,
                    role: "user",
                    verified: false,
                    uid: userCredential.user.uid
                });
            });
        })
        .then(() => {
            alert("Η εγγραφή ολοκληρώθηκε! ΠΑΡΑΚΑΛΩ ΕΛΕΓΞΤΕ ΤΟ EMAIL ΣΑΣ (" + email + ") για να ενεργοποιήσετε το λογαριασμό σας πριν συνδεθείτε.");
            // Αποσύνδεση μέχρι να πατήσει το link στο email
            firebase.auth().signOut();
            window.location.href = "index.html"; 
        })
        .catch((error) => {
            alert("Σφάλμα: " + error.message);
        });
}
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // Ο χρήστης συνδέθηκε επιτυχώς
            console.log("Google User:", result.user);
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            alert("Σφάλμα Google Sign-in: " + error.message);
        });
}
window.onload = generateCaptcha;
