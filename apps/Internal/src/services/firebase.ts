import { initializeApp } from 'firebase/app';
import {
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from 'firebase/messaging';
import { FIREBASE_CONFIG, FIREBASE_VAPID_KEY } from '../constants';

const firebaseConfig = JSON.parse(FIREBASE_CONFIG ?? '{}');
let messaging: any = null;

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize messaging with error handling
const initializeMessaging = async () => {
  try {
    // Check if messaging is supported in this browser
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      console.log('✅ Firebase messaging initialized successfully');
    } else {
      console.warn('⚠️ Firebase messaging is not supported in this browser');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase messaging:', error);
  }
};

// Initialize messaging
initializeMessaging();

export { messaging };

export const requestFcmToken = () => {
  if (!messaging) {
    console.warn('⚠️ Firebase messaging not available');
    return Promise.resolve(null);
  }
  return getToken(messaging, {
    vapidKey: FIREBASE_VAPID_KEY,
  });
};

export const revokeFcmToken = () => {
  if (!messaging) {
    console.warn('⚠️ Firebase messaging not available');
    return Promise.resolve(true);
  }
  return deleteToken(messaging);
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.warn('⚠️ Firebase messaging not available');
      resolve(null);
      return;
    }
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
