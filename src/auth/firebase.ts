import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAs68_RqFj3AJNtLgLYAMvE9aII5fhYfBY",
  authDomain: "carrer-bot.firebaseapp.com",
  projectId: "carrer-bot",
  appId: "1:837811294843:web:5a32d0a49d0d4a5f26c8de",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
