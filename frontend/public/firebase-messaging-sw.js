importScripts(
  "https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js"
);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoQ90JgW1cc_EeC3jCjptLkpndgVVEXSA",
  authDomain: "notifications-71b46.firebaseapp.com",
  projectId: "notifications-71b46",
  storageBucket: "notifications-71b46.firebasestorage.app",
  messagingSenderId: "338996953323",
  appId: "1:338996953323:web:01e254f5b1eb212d99beae",
  measurementId: "G-KCEF9F9MT6",
};

firebase.initializeApp(firebaseConfig);

class CustomPushEvent extends Event {
  constructor(data) {
    super("push");

    Object.assign(this, data);
    this.custom = true;
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener("push", (e) => {
  // Skip if event is our own custom event
  if (e.custom) return;

  // Kep old event data to override
  const oldData = e.data;

  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  // Stop event propagation
  e.stopImmediatePropagation();

  // Dispatch the new wrapped event
  dispatchEvent(newEvent);
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, image, icon, ...restPayload } = payload.data;

  const notificationOptions = {
    body,
    icon: image || icon || "/icons/firebase-logo.png",
    data: restPayload,
    badge: "/icons/firebase-logo.png",
    vibrate: [200, 100, 200],
    tag: "notification-1",
  };

  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event?.notification?.data?.link) {
    self.clients.openWindow(event.notification.data.link);
  }
});
