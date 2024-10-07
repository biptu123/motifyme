import { Note } from "@/models/Note";
import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import classNames from "classnames";
import { useDeleteNoteMutation } from "@/store/slices/noteSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { router } from "expo-router";

type PropsType = {
  note: Note;
  expanded: boolean | false;
  handleToggle: (flag: boolean | false, id: string | number) => void;
};

const NoteCard = ({ note, expanded, handleToggle }: PropsType) => {
  const [deleteNote, { isLoading }] = useDeleteNoteMutation();
  const user = useSelector((state: RootState) => state.user);
  const handleDelete = (id: string) => {
    deleteNote({
      id,
      username: user.username,
      token: user.accessToken ?? "",
    });
  };

  return (
    <Pressable
      style={{
        backgroundColor: note.color,
      }}
      className={classNames(
        `w-full rounded-[20px] px-[55] my-2`,
        {
          "h-[53]": !expanded,
          "h-[215]": expanded,
        },
        {
          "justify-center": !expanded,
          "justify-between": expanded,
        },
        { "py-[55]": expanded }
      )}
      onPress={() => handleToggle(false, note.id.toString())}
    >
      {/* Close Button */}
      <Pressable
        className={classNames("absolute top-[25] right-[20]", {
          hidden: !expanded,
        })}
        onPress={() => handleToggle(true, note.id.toString())}
      >
        <Image
          source={require("@/assets/icons/up.png")}
          className="h-[50] w-[50] "
        />
      </Pressable>

      {/* Edit Button */}
      <Pressable
        className={classNames("absolute top-[75] right-[25]", {
          hidden: !expanded,
        })}
        onPress={() =>
          router.navigate({
            pathname: "/(dashboard)/edit",
            params: {
              id: note.id.toString(),
              title: note.title,
              desc: note.desc,
              color: note.color,
              createdAt: note.createdAt,
            },
          })
        }
      >
        <Image
          source={require("@/assets/icons/edit.png")}
          className="h-[40] w-[40] "
        />
      </Pressable>
      {/* Delete Button */}
      {isLoading ? (
        <View
          className={classNames("absolute top-[150] right-[25]", {
            hidden: !expanded,
          })}
        >
          <ActivityIndicator
            animating={true}
            color={"#e40808"}
            size={"large"}
          />
        </View>
      ) : (
        <Pressable
          className={classNames("absolute top-[150] right-[25]", {
            hidden: !expanded,
          })}
          onPress={() => handleDelete(note.id.toString())}
        >
          <Image
            source={require("@/assets/icons/delete.png")}
            className="h-[40] w-[40] "
          />
        </Pressable>
      )}

      <Image
        source={require("@/assets/icons/star.png")}
        className={classNames("h-[25] w-[25] absolute left-[15]", {
          hidden: expanded,
        })}
      />
      <View
        className={classNames("items-end", {
          hidden: !expanded,
        })}
      ></View>
      <View className="flex-row justify-between items-center">
        <View className="">
          <Text
            className={classNames({
              "text-[13px] font-[700]": !expanded,
              "text-[16px] font-[900]": expanded,
            })}
          >
            {note.title}
          </Text>
          <Text
            className={classNames("text-[16px] font-[400]", {
              hidden: !expanded,
            })}
          >
            {note.desc}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default NoteCard;
