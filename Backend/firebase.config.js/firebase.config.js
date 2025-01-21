const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyA_DtLjcHbx6d4cVAx7_6u9kJ85yBrc1yQ",
  authDomain: "netflix-clone-75fe7.firebaseapp.com",
  projectId: "netflix-clone-75fe7",
  storageBucket: "netflix-clone-75fe7.firebasestorage.app",
  messagingSenderId: "633061383753",
  appId: "1:633061383753:web:3738bbad3338864b662998"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

module.exports = { db, auth, storage };