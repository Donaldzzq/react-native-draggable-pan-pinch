import React, { ReactNode } from "react";
import { StyleSheet, Dimensions, ViewStyle } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { withTiming } from "react-native-reanimated";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface DraggablePanPinchProps {
  children: ReactNode;
  style?: ViewStyle;
  initialScale?: number;
  initialRotation?: number;
  maxScale?: number;
  minScale?: number;
  boundaryX?: number;
  boundaryY?: number;
  enablePan?: boolean;
  enablePinch?: boolean;
  enableRotation?: boolean;
  onScaleChange?: (scale: number) => void;
  onPositionChange?: (x: number, y: number) => void;
  onRotationChange?: (rotation: number) => void;
}

export const DraggablePanPinch = ({
  children,
  style,
  initialScale = 1,
  initialRotation = 0,
  maxScale = 5,
  minScale = 0.5,
  boundaryX = SCREEN_WIDTH / 2,
  boundaryY = SCREEN_HEIGHT / 2,
  enablePan = true,
  enablePinch = true,
  enableRotation = false,
  onScaleChange,
  onPositionChange,
  onRotationChange,
}: DraggablePanPinchProps) => {
  // Shared values for animations
  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  const rotation = useSharedValue(initialRotation);
  const savedRotation = useSharedValue(initialRotation);
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const startTranslateX = useSharedValue(0);
  const startTranslateY = useSharedValue(0);

  // Pinch gesture for scaling
  const pinchGesture = Gesture.Pinch()
    .enabled(enablePinch)
    .onUpdate((e: { scale: number }) => {
      const newScale = savedScale.value * e.scale;
      // Limit scale between minScale and maxScale
      scale.value = Math.max(minScale, Math.min(maxScale, newScale));
      onScaleChange?.(scale.value);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Pan gesture for moving
  const panGesture = Gesture.Pan()
    .enabled(enablePan)
    .onUpdate((e: { translationX: number; translationY: number }) => {
      positionX.value = startTranslateX.value + e.translationX;
      positionY.value = startTranslateY.value + e.translationY;
      onPositionChange?.(positionX.value, positionY.value);
    })
    .onEnd(() => {
      // Check if the view is out of bounds
      if (Math.abs(positionX.value) > boundaryX) {
        positionX.value = withTiming(
          boundaryX * (positionX.value > 0 ? 1 : -1),
          { duration: 100 }
        );
      } else {
        startTranslateX.value = positionX.value;
      }
      
      if (Math.abs(positionY.value) > boundaryY) {
        positionY.value = withTiming(
          boundaryY * (positionY.value > 0 ? 1 : -1),
          { duration: 100 }
        );
      } else {
        startTranslateY.value = positionY.value;
      }
      
      onPositionChange?.(positionX.value, positionY.value);
    });

  // Rotation gesture
  const rotationGesture = Gesture.Rotation()
    .enabled(enableRotation)
    .onUpdate((e: { rotation: number }) => {
      rotation.value = savedRotation.value + e.rotation * 180 / Math.PI;
      onRotationChange?.(rotation.value);
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  // Combine gestures based on what's enabled
  const gesturesArray = [
    enablePinch ? pinchGesture : null,
    enablePan ? panGesture : null,
    enableRotation ? rotationGesture : null,
  ];
  
  // Filter out null values
  const enabledGestures = gesturesArray.filter(Boolean) as ReturnType<typeof Gesture.Pinch>[];

  // Default to a simple tap gesture if no gestures are enabled
  // This prevents an error when spreading an empty array into Gesture.Race()
  const composed = enabledGestures.length > 0 
    ? Gesture.Race(...enabledGestures) 
    : Gesture.Tap().enabled(false); // Disabled tap gesture as fallback

  // Animated styles for transformations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.container, style, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
