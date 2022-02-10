import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
// 인증정보!
apiKey: "AIzaSyAA_13sjLkawB2DG7EydscN0zDZDzQI35Y",
authDomain: "image-community-9515d.firebaseapp.com",
projectId: "image-community-9515d",
storageBucket: "image-community-9515d.appspot.com",
messagingSenderId: "996888319814",
appId: "1:996888319814:web:296973a2c33a34692df747",
measurementId: "G-0P521H8N20"
};

const app = initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;

const firestore = getFirestore();
const storage = getStorage();

const auth = getAuth();

export {app, auth, apiKey, firestore, storage};