import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import {
  fetchRandomNotification,
  scheduleNotification,
  stopNotifications,
} from "./notification";

const TIME_INTERVAL = process.env.EXPO_PUBLIC_TIME_INTERVAL;

const BACKGROUND_FETCH_TASK = "background-fetch-task";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const response = await fetchRandomNotification();
    if (response?.title && response?.message) {
      await scheduleNotification(response);
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log("Error in background task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundFetch = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: Number(TIME_INTERVAL),
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log("Background fetch task registered successfully");
  } catch (error) {
    console.log("Error registering background fetch task:", error);
  }
};

export const unregisterBackgroundFetch = async () => {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    await stopNotifications();
    console.log("Background fetch task unregistered successfully");
  } catch (error) {
    console.log("Error unregistering background fetch task:", error);
  }
};
