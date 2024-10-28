import { View, Image, Pressable, Alert, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { _retrieveToken } from "@/lib/async-storage";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import Notes from "@/components/Notes";

const Dashboard = () => {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Check if the user is logged in
      _retrieveToken().then((retrievedToken) => {
        if (!retrievedToken) {
          // Navigate to login if no token
          router.navigate("/login");
        }
      });
    }, [])
  );

  return (
    <SafeAreaView className="relative">
      <Pressable
        className="absolute bottom-[20] right-[20] z-50"
        onPress={() => router.navigate("/(dashboard)/add" as Href<string>)}
      >
        <Image
          source={require("@/assets/icons/add.png")}
          className="w-[100] h-[100]"
        />
      </Pressable>

      <View className="content-center items-center mt-[10]">
        <View className="mx-[21]">
          <Header />
        </View>

        <Notes />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
