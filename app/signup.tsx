import IntputError from "@/components/IntputError";
import { useSignup } from "@/lib/cognito";
import { Link, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState<any>(null);
  const [errKey, setErrKey] = useState(0);

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

    if (!phone) {
      setErrMessage({ phone: "Phone number is required" });
      setErrKey((prev) => prev + 1);
      return; // Exit early
    }

    if (!password) {
      setErrMessage({ password: "Password is required" });
      setErrKey((prev) => prev + 1);
      return; // Exit early
    }

    if (password !== confirmPassword) {
      setErrMessage({ password: "Passwords do not match" });
      setErrKey((prev) => prev + 1);
      return; // Exit early
    }
    setLoading(true);

    try {
      const response = await useSignup(username, password, phone);
      router.navigate("/signup");
      setErrMessage(null); // Clear error message
    } catch (err) {
      setErrMessage(err); // Set error message
      setErrKey((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex justify-evenly h-full items-center">
      <Text className="font-bold text-5xl text-center">Signup</Text>

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

          {/* Username error message */}
          <IntputError key={errKey}>{errMessage?.username}</IntputError>
        </View>

        {/* Phone Input with Icon */}
        <View className="relative">
          <TextInput
            className="p-3 pl-[55px] bg-slate-200 rounded-3xl min-w-[80vw] font-medium text-xl text-gray-700"
            placeholder="Phone number"
            onChangeText={(phone) => setPhone(phone)}
            value={phone}
          />
          <Image
            source={require("../assets/icons/phone.png")}
            className="h-[52] w-[52] absolute"
          />
          {/* Phone error message */}
          <IntputError key={errKey}>{errMessage?.phone}</IntputError>
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
          {/* Password error message */}
          <IntputError key={errKey}>{errMessage?.password}</IntputError>
        </View>

        {/* Confirm Password Input with Icon */}
        <View className="relative">
          <TextInput
            className="p-3 pl-[55] bg-slate-200 rounded-3xl min-w-[80vw] font-medium text-xl text-gray-700"
            placeholder="Confirm password"
            onChangeText={(confirmPassword) =>
              setConfirmPassword(confirmPassword)
            }
            secureTextEntry={true}
            defaultValue={confirmPassword}
          />
          <Image
            source={require("../assets/icons/confirm.png")}
            className="h-[52] w-[52] absolute"
          />
        </View>
      </View>

      {/* Submit Button */}
      {loading ? (
        <ActivityIndicator animating={true} color={"#000000"} size={"large"} />
      ) : (
        <Pressable
          className="w-[193] bg-[#FF2323] p-3 flex items-center justify-center rounded-3xl"
          onPress={handleSubmit}
        >
          <Text className="text-center text-white font-bold">Submit</Text>
        </Pressable>
      )}

      <View className=" w-[80vw] flex-row justify-between">
        <Text className="font-medium text-lg">Already have an account? </Text>
        <Link className="font-medium text-lg text-[#FF2323]" href="/login">
          Sign in
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
