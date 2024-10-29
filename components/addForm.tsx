import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import classNames from "classnames";
import SwipeButton, { RefType } from "./SwipeButton";
import {
  useAddNoteMutation,
  useGetAllIdsQuery,
} from "@/store/slices/noteSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { calcId } from "@/utils/calcId";
import { router } from "expo-router";

const colors = ["#FFC90B", "#BFFC71", "#A1F9EA", "#538CCF", "#F46060"];

const AddForm = () => {
  const user = useSelector((state: RootState) => state.user);
  const { data, isLoading, isSuccess, isError } = useGetAllIdsQuery(null);

  const [createNote] = useAddNoteMutation();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [createdAt, setCreatedAt] = useState(new Date());
  const [color, setColor] = useState("#FFC90B");

  const swipeButtonRef = useRef<RefType>(null);

  const onToggle = async () => {
    if (isError || !isSuccess) return handleReset();
    if (data.statusCode !== 200) return handleReset();

    const id = calcId(data.body);
    if (!id) return handleReset();

    const note = {
      note_id: id,
      note_details: {
        title,
        desc,
        color,
      },
    };

    const response = await createNote(note);
    console.log(response);
    if ("statusCode" in response.data && response?.data?.statusCode === 200) {
      router.navigate("/(dashboard)");
    }
    handleReset();
  };

  const handleReset = () => {
    if (swipeButtonRef.current) {
      swipeButtonRef.current.reset();
    }
  };

  return (
    <ScrollView>
      <TextInput
        onChangeText={(value) => setTitle(value)}
        value={title}
        placeholder="Enter the title"
        className="font-[900] text-[40px] bg-slate-200 py-5"
        multiline={true}
        textAlignVertical="top"
        style={{
          minHeight: 50,
          maxHeight: 150,
          padding: 10,
          borderRadius: 10,
        }}
      />

      <View className="mt-[50] mb-[20]">
        <Text className="font-[700] text-[16px]">
          {createdAt.toLocaleString("en-US", { weekday: "long" })}
        </Text>
        <Text className="font-[700] text-[16px]">
          {`${createdAt.toLocaleString("en-US", { month: "long" })} ${String(
            createdAt.getDate()
          ).padStart(2, "0")}, ${createdAt.getFullYear()}`}
        </Text>
      </View>
      <View className="h-[300] rounded-[42px] bg-[#332B2B] p-10">
        <TextInput
          onChangeText={(value) => setDesc(value)}
          value={desc}
          placeholder="Enter the content"
          placeholderTextColor="#b5a7a7"
          className="font-[700] text-[16px] text-white"
          multiline={true}
          textAlignVertical="top"
          style={{
            minHeight: "100%",
            maxHeight: "100%",
          }}
        />
      </View>
      <View className="flex-row justify-around my-[20]">
        {colors.map((c, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setColor(c)}
              className={classNames({
                "bg-black rounded-full": c === color,
              })}
            >
              <View
                style={{
                  backgroundColor: c,
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  margin: 5,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="my-[20] justify-center items-center pb-[50]">
        <SwipeButton onToggle={onToggle} ref={swipeButtonRef} />
      </View>
    </ScrollView>
  );
};

export default AddForm;
