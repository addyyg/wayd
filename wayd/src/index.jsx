import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/analytics';
import './index.css';
import App from './App.jsx';
import * as serviceWorker from './serviceWorker';

var firebaseConfig = {
    apiKey: "AIzaSyCfrzd11unlxVN8cxecYyyV13W-8gT_Hl0",
    authDomain: "wayd-7b7d5.firebaseapp.com",
    databaseURL: "https://wayd-7b7d5.firebaseio.com",
    projectId: "wayd-7b7d5",
    storageBucket: "wayd-7b7d5.appspot.com",
    messagingSenderId: "431116147845",
    appId: "1:431116147845:web:05577318bc0bc88475ddec",
    measurementId: "G-1130H802Q9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();