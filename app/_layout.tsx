import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "@/store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { requestNotificationPermission } from "@/lib/notification";
import { Alert, BackHandler } from "react-native";

const RootLayout = () => {
  useEffect(() => {
    requestNotificationPermission().then((hasPermission) => {
      console.log(hasPermission);
      if (!hasPermission) {
        Alert.alert(
          "Error",
          "Notification permission is required to use this app."
        );
        router.replace("/login");
        // BackHandler.exitApp();
      }
    });
  });
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        </Stack>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
