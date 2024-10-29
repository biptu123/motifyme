import { View, Text, Platform } from "react-native";
import React, { useCallback, useRef } from "react";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import { useFocusEffect } from "expo-router";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const TitleText = () => {
  const bannerRef = useRef<BannerAd>(null);
  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });
  useFocusEffect(
    useCallback(() => {
      bannerRef.current?.load();
    }, [])
  );
  return (
    <>
      <View className="mt-5">
        <BannerAd
          ref={bannerRef}
          unitId={adUnitId}
          size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
        />
      </View>
      <View className="my-[50] w-[90%] ml-auto mr-auto">
        <Text className="font-[900] text-[40px]">YOUR</Text>
        <Text className="font-bold text-[40px]">NOTES</Text>
      </View>
    </>
  );
};

export default TitleText;
