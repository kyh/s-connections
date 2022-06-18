import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtCFqpLTc7G1gOagloqqdnd1d5Q7-KgEA",
  authDomain: "test-project-2022-q2-2.firebaseapp.com",
  projectId: "test-project-2022-q2-2",
  storageBucket: "test-project-2022-q2-2.appspot.com",
  messagingSenderId: "80186750278",
  appId: "1:80186750278:web:81dcb87336f43b0f1f2147",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
