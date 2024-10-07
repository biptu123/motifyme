import React from "react";
import { Stack, Tabs } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
    </Stack>
  );
}
