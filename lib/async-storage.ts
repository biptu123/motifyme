import AsyncStorage from "@react-native-async-storage/async-storage";

const _storeUsername = async (value: string | null) => {
  if (!value) return;
  try {
    await AsyncStorage.setItem("@motifyme:username", value);
  } catch (error) {
    console.log("🚀 ~ Error storing username: ", error);
  }
};

const _retrieveUsername = async (): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem("@motifyme:username");
    return value;
  } catch (error) {
    console.log("🚀 ~ Error retrieving username: ", error);
    return null;
  }
};

const _removeUsername = async () => {
  try {
    await AsyncStorage.removeItem("@motifyme:username");
    console.log("username removed successfully");
  } catch (error) {
    console.log("🚀 ~ Error removing username: ", error);
  }
};

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

const _storeIds = async (value: string | null) => {
  if (!value) return;
  try {
    await AsyncStorage.setItem("@motifyme:ids", value);
  } catch (error) {
    console.log("🚀 ~ Error storing ids: ", error);
  }
};

const _retrieveIds = async (): Promise<string[] | null> => {
  try {
    const value = await AsyncStorage.getItem("@motifyme:ids");
    return JSON.parse(value ?? "");
  } catch (error) {
    console.log("🚀 ~ Error retrieving ids: ", error);
    return null;
  }
};

export {
  _storeToken,
  _retrieveToken,
  _removeToken,
  _storeUsername,
  _retrieveUsername,
  _removeUsername,
  _storeIds,
  _retrieveIds,
};
