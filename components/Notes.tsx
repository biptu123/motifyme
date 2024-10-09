import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import NoteCard from "./NoteCard";
import Skeleton from "./Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useFocusEffect } from "expo-router";
import { useGetAllNotesQuery } from "@/store/slices/noteSlice";

const Notes = () => {
  const [expanded, setExpanded] = useState<string>("");
  const user = useSelector((state: RootState) => state.user);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | null>(null);

  // Fetch notes, and refetch when lastEvaluatedKey changes
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllNotesQuery(lastEvaluatedKey);

  const handleToggle = (flag: boolean | null = null, id: string | number) => {
    if (flag) setExpanded("");
    else setExpanded(id.toString());
  };

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && notes && notes.ids && notes.ids.length > 0) {
        setExpanded(notes.ids[0]); // Expand the first note if available
      }
    }, [notes, isLoading])
  );

  const handleShowNext = () => {
    if (notes?.lastEvaluatedKey) {
      setLastEvaluatedKey(
        encodeURIComponent(JSON.stringify(notes.lastEvaluatedKey))
      );
    } else {
      setLastEvaluatedKey(null); // No more notes to fetch
    }
  };

  if (isLoading) {
    return (
      <View style={{ padding: 20 }}>
        <Skeleton width="80%" height={30} borderRadius={8} />
        <View style={{ height: 20 }} />
        <Skeleton width="60%" height={20} borderRadius={4} />
      </View>
    );
  }

  if (isError) return <Text>Failed to load notes.</Text>;

  if (isSuccess) {
    const { ids, entities } = notes;
    return (
      <View className="mx-[21] mb-[100]">
        {ids?.map((noteId: string) => (
          <NoteCard
            note={entities[noteId]}
            expanded={expanded === noteId}
            handleToggle={handleToggle}
            key={noteId}
          />
        ))}

        {notes?.lastEvaluatedKey && (
          <Pressable onPress={handleShowNext}>
            <Text>Show Next</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return null;
};

export default Notes;
