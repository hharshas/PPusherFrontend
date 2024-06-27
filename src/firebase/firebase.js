import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjT1HNgBQ7dOpN8vGKnrD4-SI6i11RJVY",
  authDomain: "ppusher-3f6ae.firebaseapp.com",
  projectId: "ppusher-3f6ae",
  storageBucket: "ppusher-3f6ae.appspot.com",
  messagingSenderId: "598610341091",
  appId: "1:598610341091:web:cb5bd403647e69f41469d6",
  measurementId: "G-BWRJF4X1SB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
