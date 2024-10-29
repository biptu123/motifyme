import { View, Image, Pressable, Alert, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { _retrieveToken } from "@/lib/async-storage";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import Notes from "@/components/Notes";
import { Button } from "react-native";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ["fashion", "clothing"],
});

const Dashboard = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    // Check if the user is logged in
    _retrieveToken().then((retrievedToken) => {
      if (!retrievedToken) {
        // Navigate to login if no token
        router.navigate("/login");
      }
    });

    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loaded) interstitial.show();
  }, [loaded]);

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
