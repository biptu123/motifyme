import { View, Vibration } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
} from "react-native-reanimated";

interface PropsTypes {
  className?: string;
  children?: React.ReactNode;
}

const InputError = ({ children, className }: PropsTypes) => {
  if (!children) return null;

  const X = useSharedValue(0);

  useEffect(() => {
    // Trigger vibration and animation when error appears
    Vibration.vibrate(500);

    // Shake animation (vibrate horizontally)
    X.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 50 }), 5, true),
      withTiming(0, { duration: 50 })
    );
  }, []);

  // Animated style for shaking effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: X.value }],
    };
  });

  return (
    <View className="h-5 justify-center items-center">
      <Animated.Text
        style={animatedStyle}
        className={`absolute text-red-600 text-sm font-semibold ${className}`}
      >
        {children}
      </Animated.Text>
    </View>
  );
};

export default InputError;
