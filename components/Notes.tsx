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

  // Fetch notes, refetch when lastEvaluatedKey changes
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllNotesQuery(lastEvaluatedKey);

  const { ids, entities } = notes;

  const handleToggle = (flag: boolean | null = null, id: string | number) => {
    if (flag) setExpanded("");
    else setExpanded(id.toString());
  };

  useFocusEffect(
    useCallback(() => {
      if (notes && ids?.length > 0 && expanded === "") {
        setExpanded(ids[0]); // Expand the first note initially
      }
    }, [notes])
  );

  // Function to handle fetching more notes when the user reaches the end of the list
  const handleShowNext = () => {
    if (notes?.lastEvaluatedKey && !loadingMore) {
      setLoadingMore(true);
      setLastEvaluatedKey(
        encodeURIComponent(JSON.stringify(notes.lastEvaluatedKey))
      );
    }
  };

  useEffect(() => {
    if (notes && loadingMore) {
      setLoadingMore(false);
    }
  }, [notes]);

  if (isLoading && ids?.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Skeleton width="80%" height={30} borderRadius={8} />
        <View style={{ height: 20 }} />
        <Skeleton width="60%" height={20} borderRadius={4} />
      </View>
    );
  }

  if (isError) return <Text>Failed to load notes.</Text>;

  return (
    <View className="w-full">
      <FlatList
        className="h-[90vh]"
        showsVerticalScrollIndicator={true}
        data={ids}
        keyExtractor={(id) => id}
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
        renderItem={({ item: id }) =>
          id && (
            <View className="w-[90%] ml-auto mr-auto">
              <NoteCard
                note={entities[id]}
                expanded={expanded === id}
                handleToggle={handleToggle}
                key={id}
              />
            </View>
          )
        }
        onEndReached={handleShowNext}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
};

export default Notes;
