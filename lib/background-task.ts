import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

export const BACKGROUND_FETCH_TASK = "background-fetch";

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 1, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export async function getStatusAsync() {
  return BackgroundFetch.getStatusAsync();
}

export async function isTaskRegisteredAsync() {
  return TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
}

export async function getBackgroundFetchStatus(status: any) {
  return BackgroundFetch.BackgroundFetchStatus[status];
}
