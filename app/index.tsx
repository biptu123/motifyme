import React, { useEffect } from "react";
import { Alert, BackHandler, Text } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetchUser from "@/hooks/useFetchUser";
import { useSelector } from "react-redux";
import store, { RootState } from "@/store/store";
import { noteApiSlice, useGetAllNotesQuery } from "@/store/slices/noteSlice";
import { _retrieveToken } from "@/lib/async-storage";
import { requestNotificationPermission } from "@/lib/notification";
store.dispatch(noteApiSlice.endpoints.getAllNotes.initiate(null));

const Index = () => {
  const router = useRouter();
  const { loading, error } = useFetchUser();
  const { isLoading, isError } = useGetAllNotesQuery(null);

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
    if (isError || error) {
      router.replace("/login");
    }
    if (!loading && !isLoading) {
      _retrieveToken().then((token) => {
        if (token) {
          router.replace("/(dashboard)");
        } else {
          router.replace("/login");
        }
      });
    }
  }, [loading, router, isLoading, isError, error]);

  return (
    <SafeAreaView>
      <Text className="text-center pt-[40vh] text-[50px] font-[900]">
        MotifyMe
      </Text>
    </SafeAreaView>
  );
};

export default Index;
