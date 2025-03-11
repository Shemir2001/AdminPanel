import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions,httpsCallable} from "firebase/functions";
const firebaseConfig = {
    apiKey: "AIzaSyDzOj80lVA0UxYlpZvod8kNOCxWhHPUyw0",
    authDomain: "rbb-app-46ada.firebaseapp.com",
    projectId: "rbb-app-46ada",
    storageBucket: "rbb-app-46ada.appspot.com",
    messagingSenderId: "625912200884",
    appId: "1:625912200884:web:187f039dbd596deea361e1",
    measurementId: "G-GFBLH07E30"
  };
export const app=initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const firestore=getFirestore(app)
export const storage=getStorage(app)
export const functions=getFunctions(app)
