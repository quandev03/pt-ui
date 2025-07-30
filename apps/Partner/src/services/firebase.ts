import { initializeApp } from 'firebase/app';
import {
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
} from 'firebase/messaging';
import { FIREBASE_CONFIG, FIREBASE_VAPID_KEY } from '../constants';

const firebaseConfig = JSON.parse(FIREBASE_CONFIG ?? '{}');
initializeApp(firebaseConfig);
export const messaging = getMessaging();

export const requestFcmToken = () => {
  return getToken(messaging, {
    vapidKey: FIREBASE_VAPID_KEY,
  });
};

export const revokeFcmToken = () => {
  return deleteToken(messaging);
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
