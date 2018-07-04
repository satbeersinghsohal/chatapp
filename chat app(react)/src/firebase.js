import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyC5l5xUY-4372XdHKbeP8yhYy4aorHvZEE",
    authDomain: "chatapp-40adb.firebaseapp.com",
    databaseURL: "https://chatapp-40adb.firebaseio.com",
    projectId: "chatapp-40adb",
    storageBucket: "chatapp-40adb.appspot.com",
    messagingSenderId: "772221733858"
  };
 export const firebaseApp =  firebase.initializeApp(config);
 export const database = firebase.database();
 export const storage = firebase.storage();