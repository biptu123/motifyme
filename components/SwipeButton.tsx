import React, { useState, useImperativeHandle, forwardRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export interface RefType {
  reset: () => void;
}
interface PropType {
  onToggle: () => void;
  height?: number;
  width?: number;
  padding?: number;
  backgroundColor?: string;
  thumbColor?: string;
  displayText?: string;
}

const SwipeButton = forwardRef<RefType, PropType>(
  (
    {
      onToggle,
      height,
      width,
      padding,
      backgroundColor,
      thumbColor,
      displayText,
    },
    ref
  ) => {
    const [toggled, setToggled] = useState(false);

    const BUTTON_HEIGHT = height || 100;
    const BUTTON_WIDTH = width || 350;
    const BUTTON_PADDING = padding || 10;
    const BUTTON_BACKGROUND = backgroundColor || "#ffffff";
    const SWIPEABLE_BACKGROUND = thumbColor || "#f0f";

    const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;
    const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
    const H_SWIPE_RANGE =
      BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

    const styles = StyleSheet.create({
      swipeContainer: {
        height: BUTTON_HEIGHT,
        width: BUTTON_WIDTH,
        backgroundColor: BUTTON_BACKGROUND,
        borderRadius: BUTTON_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
      },
      colorWave: {
        position: "absolute",
        left: 0,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
      },
      swipeable: {
        height: SWIPEABLE_DIMENSIONS,
        width: SWIPEABLE_DIMENSIONS,
        borderRadius: SWIPEABLE_DIMENSIONS,
        left: BUTTON_PADDING,
        position: "absolute",
        zIndex: 3,
      },
      swipeText: {
        alignSelf: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "#1b9aaa",
        zIndex: 2,
      },
      afterText: {
        alignSelf: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
      },
    });

    const X = useSharedValue(0);
    const InterpolateXInput = [0, H_SWIPE_RANGE];

    const animatedStyles = {
      swipeable: useAnimatedStyle(() => {
        return {
          transform: [{ translateX: X.value }],
          backgroundColor: interpolateColor(
            X.value,
            [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
            ["#06d6a0", "#fff"]
          ),
        };
      }),
      colorWave: useAnimatedStyle(() => {
        return {
          width: H_WAVE_RANGE + X.value,
          opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
        };
      }),
      swipeText: useAnimatedStyle(() => {
        return {
          opacity: interpolate(
            X.value,
            InterpolateXInput,
            [0.8, 0],
            Extrapolation.CLAMP
          ),
          transform: [
            {
              translateX: interpolate(
                X.value,
                InterpolateXInput,
                [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
                Extrapolation.CLAMP
              ),
            },
          ],
        };
      }),
    };

    const handleComplete = () => {
      setToggled(true);
      onToggle();
    };

    // Expose the reset function to the parent
    useImperativeHandle(ref, () => ({
      reset: () => {
        X.value = withSpring(0); // Reset animation
        setToggled(false); // Reset state
      },
    }));

    const pan = Gesture.Pan();
    pan
      .onUpdate((event) => {
        if (!toggled) {
          const clampedX = Math.max(
            0,
            Math.min(event.translationX, H_SWIPE_RANGE)
          );
          X.value = clampedX;
        }
      })
      .onEnd(() => {
        if (!toggled) {
          if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
            X.value = withSpring(0);
            runOnJS(setToggled)(false);
          } else {
            X.value = withSpring(H_SWIPE_RANGE);
            runOnJS(handleComplete)();
          }
        }
      });

    return (
      <GestureDetector gesture={pan}>
        <View style={styles.swipeContainer}>
          <AnimatedLinearGradient
            colors={["#06d5a0", "#1b9aaa"]}
            start={{ x: 0.0, y: 1.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={[styles.colorWave, animatedStyles.colorWave]}
          >
            <ActivityIndicator
              animating={true}
              color={"#000000"}
              size={"large"}
            />
          </AnimatedLinearGradient>

          <Animated.View
            style={[styles.swipeable, animatedStyles.swipeable]}
          ></Animated.View>
          <Animated.Text style={[styles.swipeText, animatedStyles.swipeText]}>
            {displayText ?? "Swipe To Add"}
          </Animated.Text>
        </View>
      </GestureDetector>
    );
  }
);

export default SwipeButton;
