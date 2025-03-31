import React, { ReactNode } from "react";
import { StyleSheet, Dimensions, ViewStyle, View, TouchableOpacity, Text } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { withTiming } from "react-native-reanimated";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ActionButtons {
  zoomIn?: ReactNode;
  zoomOut?: ReactNode;
  rotateLeft?: ReactNode;
  rotateRight?: ReactNode;
}

interface ShowActionButtons {
  zoomIn?: boolean;
  zoomOut?: boolean;
  rotateLeft?: boolean;
  rotateRight?: boolean;
}

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
  showButtons?: ShowActionButtons;
  actionButtons?: ActionButtons;
  actionButtonsContainerStyle?: ViewStyle;
  actionButtonsStyle?: ViewStyle;
  rotateDegree?: number;
  zoomScale?: number;
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
  showButtons = {
    zoomIn: false,
    zoomOut: false,
    rotateLeft: false,
    rotateRight: false,
  },
  actionButtons,
  actionButtonsContainerStyle,
  actionButtonsStyle,
  rotateDegree = 90,
  zoomScale = 0.5,
}: DraggablePanPinchProps) => {
  const [rotation, setRotation] = React.useState(initialRotation);
  // Shared values for animations
  const scale = useSharedValue(initialScale);
  const savedScale = useSharedValue(initialScale);
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const startTranslateX = useSharedValue(0);
  const startTranslateY = useSharedValue(0);

  const onPressRotateLeft = () => {
    const value = rotation - rotateDegree;
    setRotation(value);
    onRotationChange?.(value);
  }

  const onPressRotateRight = () => {
    const value = rotation + rotateDegree;
    setRotation(value);
    onRotationChange?.(value);
  }

  const onPressZoomIn = () => {
    scale.value = savedScale.value * (1 + zoomScale);
    onScaleChange?.(scale.value);
  }

  const onPressZoomOut = () => {
    scale.value = savedScale.value * (1 - zoomScale);
    onScaleChange?.(scale.value);
  }

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

  // Combine gestures based on what's enabled
  const gesturesArray = [
    enablePinch ? pinchGesture : null,
    enablePan ? panGesture : null,
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
      { rotate: `${rotation}deg` },
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  //check if the action buttons are enabled
  const showActionButtons = Object.values(showButtons).some((value) => value);

  return (
    <View style={styles.wrapper}>
      {showActionButtons && (
        <View style={[styles.buttonsContainer, actionButtonsContainerStyle]}>
          {enableRotation && showButtons.rotateLeft && (
            <TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressRotateLeft}>
              {actionButtons?.rotateLeft ?? <Text style={styles.buttonText}>↺</Text>}
            </TouchableOpacity>
          )}
          {enableRotation && showButtons.rotateRight && (
            <TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressRotateRight}>
              {actionButtons?.rotateRight ?? <Text style={styles.buttonText}>↻</Text>}
            </TouchableOpacity>
          )}
          {enablePinch && showButtons.zoomIn && (
            <TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressZoomIn}>
              {actionButtons?.zoomIn ?? <Text style={styles.buttonText}>+</Text>}
            </TouchableOpacity>
          )}
          {enablePinch && showButtons.zoomOut && (
            <TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressZoomOut}>
              {actionButtons?.zoomOut ?? <Text style={styles.buttonText}>-</Text>}
            </TouchableOpacity>
          )}
        </View>
      )}
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.container, style, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    height: "100%",
    width: "100%",
    position: "relative",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  buttonsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "row",
    gap: 10,
    zIndex: 10,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
