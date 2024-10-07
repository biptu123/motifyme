import React, { useEffect } from "react";
import { Alert, BackHandler, Text } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetchUser from "@/hooks/useFetchUser";
import { useSelector } from "react-redux";
import store, { RootState } from "@/store/store";
import { noteApi } from "@/store/apis/noteApi";
import { noteApiSlice } from "@/store/slices/noteSlice";

const Index = () => {
  const router = useRouter();
  const { loading, error } = useFetchUser();
  const user = useSelector((state: RootState) => state.user);
  store.dispatch(
    noteApiSlice.endpoints.getAllNotes.initiate({
      username: user.username,
      limit: 5,
      token: user.accessToken,
    })
  );

  useEffect(() => {
    const onBackPress = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user.accessToken) {
        console.log(user.accessToken);
        router.replace("/(dashboard)");
      } else {
        router.replace("/login");
      }
    }
  }, [loading, user, router]);

  return (
    <SafeAreaView>
      <Text className="text-center pt-[40vh] text-[50px] font-[900]">
        MotifyMe
      </Text>
    </SafeAreaView>
  );
};

export default Index;
