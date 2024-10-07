import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { _removeToken, _retrieveToken } from "@/lib/async-storage";
import { Href, useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import useFetchUser from "@/hooks/useFetchUser";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TitleText from "@/components/TitleText";
import Notes from "@/components/Notes";

const Dashboard = () => {
  const router = useRouter();
  const { loading, error } = useFetchUser();
  const user = useSelector((state: RootState) => state.user);
  // console.log(user.accessToken);

  useFocusEffect(
    useCallback(() => {
      if (!user || !user.accessToken) {
        router.navigate("/login");
      }
    }, [])
  );

  return (
    <SafeAreaView className=" h-full relative ">
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
