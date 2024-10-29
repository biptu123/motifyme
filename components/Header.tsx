import { View, Text, Pressable, Image, Alert } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSignout } from "@/lib/cognito";
import { router } from "expo-router";
import { _removeToken, _removeUsername } from "@/lib/async-storage";

const Header = () => {
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    Alert.alert("Hold on!", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "YES",
        onPress: async () => {
          try {
            const signoutResult = await useSignout();
            if (signoutResult === true) {
              _removeToken();
              _removeUsername();
              router.navigate("/login");
            } else {
              console.error("Error during signout:", signoutResult);
            }
          } catch (error) {
            console.error("Error signing out:", error);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-row w-full justify-between items-center pb-[10]">
      {/* User Section */}
      <View className="flex-row items-center gap-2">
        <Image
          source={require("@/assets/icons/user.png")}
          className="h-[55] w-[55]"
        />
        <Text className="text-[#921111] font-[400] text-[24px]">
          {user.username}
        </Text>
      </View>

      {/* Logout Section */}
      <Pressable onPress={handleLogout}>
        <Image
          source={require("@/assets/icons/logout.png")}
          className="h-[40] w-[35]"
        />
      </Pressable>
    </View>
  );
};

export default Header;
