import firebase from 'firebase/app';
import 'firebase/storage';

//Visit://https://firebase.google.com/docs/storage/web/upload-files

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyChNdM8jNP0Og72k-4NuzC92G3lZMVODSw",
    authDomain: "vue-axios-practise-2.firebaseapp.com",
    databaseURL: "https://vue-axios-practise-2.firebaseio.com",
    projectId: "vue-axios-practise-2",
    storageBucket: "vue-axios-practise-2.appspot.com",
    messagingSenderId: "861194984225",
    appId: "1:861194984225:web:93cee06770dc3edd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storageRef=firebase.storage().ref();

export {storageRef, firebase as default};

