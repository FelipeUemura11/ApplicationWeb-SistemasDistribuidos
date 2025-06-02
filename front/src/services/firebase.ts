
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database"; 
const firebaseConfig = {
  apiKey: "AIzaSyCzlKreJKlwuo31l99gOt979EP1Uwp7qcg",
  authDomain: "collabflow-59ecb.firebaseapp.com",
  projectId: "collabflow-59ecb",
  storageBucket: "collabflow-59ecb.firebasestorage.app",
  messagingSenderId: "7880766708",
  appId: "1:7880766708:web:0f8e0dc6a3cebc91565aa1",
  measurementId: "G-1VS9H2S3W5"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app); // Instância do Firebase Auth
const db: Database = getDatabase(app);

export { app, auth, db };