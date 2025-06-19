import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8qUQTpOMRRrm4tfdpoo14iM-VDQRHcRg",
  authDomain: "hpss-ce65a.firebaseapp.com",
  projectId: "hpss-ce65a",
  storageBucket: "hpss-ce65a.firebasestorage.app",
  messagingSenderId: "900970786420",
  appId: "1:900970786420:web:a345971791306564ceeb21"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function signIn() {
  return signInAnonymously(auth);
}

function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  console.log('Starting Google sign-in');
  return signInWithPopup(auth, provider)
    .then((result) => {
      console.log('Google sign-in successful:', result.user);
      return result;
    })
    .catch((error) => {
      console.error('Google sign-in error:', error);
      throw error;
    });
}

function signOut() {
  return firebaseSignOut(auth);
}

function onUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export { app, auth, db, signIn, signInWithGoogle, signOut, onUserChanged };
