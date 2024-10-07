import React from "react";
import {
  View,
  StyleSheet,
  DimensionValue,
  AnimatableNumericValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type SkeletonProps = {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius: AnimatableNumericValue;
};

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
}) => {
  const shimmerAnim = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withRepeat(withTiming(200, { duration: 1500 }), -1, false),
      },
    ],
  }));

  const styles = StyleSheet.create({
    skeleton: {
      backgroundColor: "#e0e0e0",
      overflow: "hidden",
      position: "relative",
      width,
      height,
      borderRadius,
    },
    shimmer: {
      width: "200%",
      height: "100%",
    },
  });

  return (
    <View style={styles.skeleton}>
      <Animated.View style={[shimmerAnim, styles.shimmer]}>
        <LinearGradient
          colors={["#e0e0e0", "#f0f0f0", "#e0e0e0"]}
          start={[0, 0.5]}
          end={[1, 0.5]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

export default Skeleton;
