import {
  View,
  Text,
  Image,
  Pressable,
  Vibration,
  Platform,
} from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AddForm from "@/components/addForm";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";
const Add = () => {
  const bannerRef = useRef<BannerAd>(null);
  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });
  const handlePress = () => {
    Vibration.vibrate(100);
    router.back();
  };
  return (
    <SafeAreaView className="h-full">
      <View className="mx-[13] my-[13] flex flex-row">
        <Pressable onPress={handlePress}>
          <Image
            source={require("@/assets/icons/back.png")}
            className="h-[45] w-[45]"
          />
        </Pressable>
        <View className="ml-auto mr-auto">
          <BannerAd
            ref={bannerRef}
            unitId={adUnitId}
            size={BannerAdSize.BANNER}
          />
        </View>
      </View>
      <View className="mx-[13] my-[13]">
        <AddForm />
      </View>
    </SafeAreaView>
  );
};

export default Add;
