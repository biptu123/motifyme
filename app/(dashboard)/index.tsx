import { View, Image, Pressable, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { _retrieveToken } from "@/lib/async-storage";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import useFetchUser from "@/hooks/useFetchUser";
import TitleText from "@/components/TitleText";
import Notes from "@/components/Notes";
import { useGetAllIdsQuery } from "@/store/slices/noteSlice";
import {
  stopNotifications,
  requestNotificationPermission,
} from "@/lib/notification";
import {
  registerBackgroundFetch,
  unregisterBackgroundFetch,
} from "@/lib/background-task";

const Dashboard = () => {
  const router = useRouter();
  const { loading, error } = useFetchUser();
  const { data: ids } = useGetAllIdsQuery(null);
  const [token, setToken] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      // Check if the user is logged in
      _retrieveToken().then((retrievedToken) => {
        if (!retrievedToken) {
          // Navigate to login if no token
          router.navigate("/login");
        } else {
          setToken(retrievedToken);
        }
      });
    }, [])
  );

  useEffect(() => {
    const setupNotifications = async () => {
      // If token and ids are valid, and permission is granted, start sending notifications
      if (token && ids && ids.length > 0) {
        // Register background task for notifications
        registerBackgroundFetch().catch((err) =>
          console.error("Failed to register background fetch:", err)
        );
      } else {
        // Stop sending notifications if no token, no permission, or ids is empty
        unregisterBackgroundFetch().catch((err) =>
          console.error("Failed to stop notifications:", err)
        );
      }
    };

    setupNotifications();

    // Cleanup notifications when component is unmounted or ids change
    return () => {
      stopNotifications().catch((err) =>
        console.error("Failed to stop notifications on unmount:", err)
      );
    };
  }, [token, ids]);

  return (
    <SafeAreaView className="h-full relative">
      <Pressable
        className="absolute bottom-[20] right-[20] z-50"
        onPress={() => router.navigate("/(dashboard)/add" as Href<string>)}
      >
        <Image
          source={require("@/assets/icons/add.png")}
          className="w-[100] h-[100]"
        />
      </Pressable>
      <View className="content-center items-center mt-[10] ">
        <View className="mx-[21]">
          <Header />
        </View>

        <View className="w-full">
          <TitleText />
          <Notes />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
