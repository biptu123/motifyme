import AsyncStorage from "@react-native-async-storage/async-storage";

const _storeToken = async (value: string | null) => {
  if (!value) return;
  try {
    await AsyncStorage.setItem("@motifyme:accessToken", value);
  } catch (error) {
    console.log("🚀 ~ Error storing token: ", error);
  }
};

const _retrieveToken = async (): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem("@motifyme:accessToken");
    return value;
  } catch (error) {
    console.log("🚀 ~ Error retrieving token: ", error);
    return null;
  }
};

const _removeToken = async () => {
  try {
    await AsyncStorage.removeItem("@motifyme:accessToken");
    console.log("Token removed successfully");
  } catch (error) {
    console.log("🚀 ~ Error removing token: ", error);
  }
};

export { _storeToken, _retrieveToken, _removeToken };
