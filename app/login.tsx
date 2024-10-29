import IntputError from "@/components/IntputError";
import { _storeToken } from "@/lib/async-storage";
import { ResponseError, ResponseSuccess, useSignin } from "@/lib/cognito";
import { setUser } from "@/store/slices/userSlice";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState<any>(null);
  const [errKey, setErrKey] = useState(0);
  const dispatch = useDispatch();

  const router = useRouter();
  const handleSubmit = async () => {
    // Clear error message if validations pass
    setErrMessage(null);

    // Validation Logic
    if (!username) {
      setErrMessage({ username: "Username is required" });
      setErrKey((prev) => prev + 1);
      return; // Exit early
    }

    if (!password) {
      setErrMessage({ password: "Password is required" });
      setErrKey((prev) => prev + 1);
      return; // Exit early
    }
    setLoading(true);

    try {
      const response: ResponseSuccess | ResponseError = await useSignin(
        username,
        password
      );

      if (
        response &&
        "username" in response &&
        "accessToken" in response &&
        response.accessToken &&
        response.username
      ) {
        dispatch(
          setUser({
            username: response.username,
            phone: response.phone ?? "",
            accessToken: response.accessToken,
          })
        );
        await _storeToken(response.accessToken);
        setErrMessage(null);
        Vibration.vibrate(150);
        router.navigate("/(dashboard)");
      } else {
        setErrMessage({ unknown: "Something went wrong please try again" });
      }
    } catch (err) {
      setErrMessage(err);
      setErrKey((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex justify-evenly h-full items-center">
      <Text className="font-bold text-5xl text-center">Login</Text>

      {/* Input fields with icons */}
      <View className="flex gap-4">
        {/* Username Input with Icon */}
        <View className="relative">
          <TextInput
            className="p-3 pl-[55] bg-slate-200 rounded-3xl min-w-[80vw] font-medium text-xl text-gray-700"
            placeholder="Username"
            onChangeText={(username) => setUsername(username)}
            defaultValue={username}
          />
          <Image
            source={require("../assets/icons/username.png")}
            className="h-[52] w-[52] absolute"
          />
          <IntputError key={errKey}>{errMessage?.username}</IntputError>
        </View>

        {/* Password Input with Icon */}
        <View className="relative">
          <TextInput
            className="p-3 pl-[55] bg-slate-200 rounded-3xl min-w-[80vw] font-medium text-xl text-gray-700"
            placeholder="Password"
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
            defaultValue={password}
          />
          <Image
            source={require("../assets/icons/password.png")}
            className="h-[52] w-[52] absolute"
          />

          {/* Username error message */}
          <IntputError key={errKey}>{errMessage?.password}</IntputError>
        </View>

        {/* Unknown Error */}
        <IntputError key={errKey}>{errMessage?.unknown}</IntputError>
      </View>

      {/* Submit Button */}
      {loading ? (
        <ActivityIndicator animating={true} color={"#000000"} size={"large"} />
      ) : (
        <Pressable
          className="w-[193] bg-[#FF2323] p-3 flex items-center justify-center rounded-3xl"
          onPress={handleSubmit}
        >
          <Text className="text-center text-white font-bold">Login</Text>
        </Pressable>
      )}

      <View className=" w-[80vw] flex-row justify-between">
        <Text className="font-medium text-lg">Don't have an account? </Text>
        <Link className="font-medium text-lg text-[#FF2323]" href="/signup">
          Sign up
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Login;
