import { BASE_URL, TIME_INTERVAL } from "@env";
import * as Notifications from "expo-notifications";
import {
  _retrieveIds,
  _retrieveToken,
  _retrieveUsername,
} from "./async-storage";

export type NotificationParams = {
  title: string;
  message: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const requestNotificationPermission = async () => {
  //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   console.log(existingStatus);

  //   if (existingStatus !== "granted") {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }

  //   if (finalStatus !== "granted") {
  //     console.log("Notification permission not granted");
  //     return false;
  //   }

  //   console.log("Notification permission granted");
  //   return true;

  const { status } = await Notifications.requestPermissionsAsync();
  console.log(status);
  return status === "granted";
};

const scheduleNotification = async ({ title, message }: NotificationParams) => {
  console.log("sheduled notification", title, message);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
    },
    trigger: {
      seconds: TIME_INTERVAL,
      repeats: true,
    },
  });
};

const stopNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const fetchRandomNotification = async () => {
  const username = await _retrieveUsername();
  const token = await _retrieveToken();
  const ids = await _retrieveIds();
  console.log(ids);
  if (!ids || !ids.length) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * ids.length);
  const randomId = ids[randomIndex];

  if (!username || !token) {
    return null;
  }
  try {
    const response = await fetch(`${BASE_URL}/${username}?id=${randomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorizationToken: token,
      },
    });
    console.log(response);
    const data = await response.json();
    if ("statusCode" in data && data.statusCode === 200) {
      return {
        title: data.body.note_details.title,
        message: data.body.note_details.desc,
      };
    }

    // Assuming the message is available as `data.message`
    return null;
  } catch (error) {
    console.error("Error fetching message:", error);
    return null;
  }
};

export {
  requestNotificationPermission,
  scheduleNotification,
  stopNotifications,
};
