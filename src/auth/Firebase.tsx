import * as firebase from 'firebase';
import { toast } from '../components/toast'; 

const config = {
  apiKey: "AIzaSyBphZvukJMBv_k9w2KEUinzQHwwZnpmwGY",
  authDomain: "lendingahand-69f01.firebaseapp.com",
  databaseURL: "https://lendingahand-69f01.firebaseio.com",
  projectId: "lendingahand-69f01",
  storageBucket: "lendingahand-69f01.appspot.com",
  messagingSenderId: "857641995363",
  appId: "1:857641995363:web:7010f7ca573786d819fc56"
};
firebase.initializeApp(config);

export async function loginUser(username: string, password: string) {

  const email = `${username}@lendingahand.com`

  try{
    const res = await firebase.auth().signInWithEmailAndPassword(email, password)
    console.log(res)
    return true
  }
  catch(error){
    console.log(error)
    return false
  }

}

export async function registerUser(username: string, password: string) {

  const email = `${username}@lendingahand.com`

  try{
    const res = await firebase.auth().createUserWithEmailAndPassword(email, password)
    toast("Registration successful")
    console.log(res)
    return true
  }
  catch(error){
    toast(error.message)
    return false
  }

}