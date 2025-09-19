import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAB_EHUINVfvgayBpHF3L_XNlt4gytmtEU",
  authDomain: "fepacoc.firebaseapp.com",
  projectId: "fepacoc",
  storageBucket: "fepacoc.firebasestorage.app",
  messagingSenderId: "619325595160",
  appId: "1:619325595160:web:974ee7f0804c1ea74fad6d",
  measurementId: "G-G06H8GXM19",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;