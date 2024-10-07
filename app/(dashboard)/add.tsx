import { View, Text, Image, Pressable, Vibration } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AddForm from "@/components/addForm";

const Add = () => {
  const handlePress = () => {
    Vibration.vibrate(100);
    router.back();
  };
  return (
    <SafeAreaView className="h-full">
      <View className="mx-[13] my-[13]">
        <Pressable onPress={handlePress}>
          <Image
            source={require("@/assets/icons/back.png")}
            className="h-[45] w-[45]"
          />
        </Pressable>
      </View>
      <View className="mx-[13] my-[13]">
        <AddForm />
      </View>
    </SafeAreaView>
  );
};

export default Add;
