import { View, Text, Image, Pressable, Vibration } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import EditFrom from "@/components/editForm";
import { Note } from "@/models/Note";

const Edit = () => {
  const params = useLocalSearchParams();
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
        <EditFrom
          note={{
            id: params.id.toString(),
            title: params.title.toString(),
            desc: params.desc.toString(),
            createdAt: params.createdAt.toString(),
            color: params.color.toString(),
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Edit;
