import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import NoteCard from "./NoteCard";
import Skeleton from "./Skeleton";
import { useFocusEffect } from "expo-router";
import { useGetAllNotesQuery } from "@/store/slices/noteSlice";
import { FlatList } from "react-native-gesture-handler";
import TitleText from "./TitleText";

const Notes = () => {
  const [expanded, setExpanded] = useState<string>("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | null>(null);
  const [notes, setNotes] = useState<any[]>([]);

  // Fetch notes, refetch when lastEvaluatedKey changes
  const {
    data: fetchedNotes,
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
      if (notes && notes.length > 0 && expanded === "") {
        setExpanded(notes[0].id); // Expand the first note initially
      }
    }, [notes])
  );

  useEffect(() => {
    if (fetchedNotes && fetchedNotes.ids?.length > 0) {
      setNotes((prevNotes) => {
        // Avoid re-setting the same data, which can trigger unnecessary renders
        const newNotes = Object.values(fetchedNotes.entities);
        const combinedNotes = [...prevNotes, ...newNotes];

        // Prevent duplicates in case the same notes are fetched again
        const uniqueNotes = Array.from(
          new Set(combinedNotes.map((note) => note.id))
        ).map((id) => combinedNotes.find((note) => note.id === id));

        return uniqueNotes;
      });
    }
  }, [fetchedNotes.ids]);

  // Function to handle fetching more notes when the user reaches the end of the list
  const handleShowNext = () => {
    if (fetchedNotes?.lastEvaluatedKey && !loadingMore) {
      setLoadingMore(true);
      setLastEvaluatedKey(
        encodeURIComponent(JSON.stringify(fetchedNotes.lastEvaluatedKey))
      );
    }
  };

  useEffect(() => {
    if (fetchedNotes && loadingMore) {
      setLoadingMore(false);
    }
  }, [fetchedNotes]);

  if (isLoading && notes.length === 0) {
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
    return (
      <View className="w-full">
        <FlatList
          className="mx-[21] h-[90vh]"
          showsVerticalScrollIndicator={true}
          data={notes}
          keyExtractor={(note, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListHeaderComponent={<TitleText />}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                animating={true}
                color={"#000000"}
                size={"large"}
              />
            ) : null // Only show ActivityIndicator if loading more notes
          }
          renderItem={({ item: note }: { item: any }) =>
            note && (
              <NoteCard
                note={note}
                expanded={expanded === note.id}
                handleToggle={handleToggle}
                key={note.id}
              />
            )
          }
          onEndReached={handleShowNext}
          onEndReachedThreshold={0.1}
        />
      </View>
    );
  }

  return null;
};

export default Notes;
