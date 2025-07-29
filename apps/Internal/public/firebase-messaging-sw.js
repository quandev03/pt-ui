const window = {};
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js'
);
importScripts('env-config.js');

const firebaseConfig = JSON.parse(window._env_.VITE_FIREBASE_CONFIG_OBJECT);
console.log('Webworker firebase config: ', firebaseConfig);
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
