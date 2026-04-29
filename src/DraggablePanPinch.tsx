import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, useWindowDimensions, ViewStyle, View, TouchableOpacity, Text } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  runOnJS,
  runOnUI,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

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
  style?: StyleProp<ViewStyle>;
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
  actionButtonsContainerStyle?: StyleProp<ViewStyle>;
  actionButtonsStyle?: StyleProp<ViewStyle>;
  rotateDegree?: number;
  zoomScale?: number;
}

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(max, Math.max(min, value));
};

export const DraggablePanPinch = ({
  children,
  style,
  initialScale = 1,
  initialRotation = 0,
  maxScale = 5,
  minScale = 0.5,
  boundaryX,
  boundaryY,
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
  const { width, height } = useWindowDimensions();
  const resolvedBoundaryX = boundaryX ?? width / 2;
  const resolvedBoundaryY = boundaryY ?? height / 2;

  const emitScaleChange = React.useCallback((nextScale: number) => {
    onScaleChange?.(nextScale);
  }, [onScaleChange]);

  const emitPositionChange = React.useCallback((x: number, y: number) => {
    onPositionChange?.(x, y);
  }, [onPositionChange]);

  const emitRotationChange = React.useCallback((nextRotation: number) => {
    onRotationChange?.(nextRotation);
  }, [onRotationChange]);

  const clampedInitialScale = clamp(initialScale, minScale, maxScale);
  const scale = useSharedValue(clampedInitialScale);
  const savedScale = useSharedValue(clampedInitialScale);
  const rotation = useSharedValue(initialRotation);
  const savedRotation = useSharedValue(initialRotation);
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const startTranslateX = useSharedValue(0);
  const startTranslateY = useSharedValue(0);
  const zoomFactor = 1 + zoomScale;

  const animateScaleBy = React.useCallback((multiplier: number) => {
    runOnUI((factor: number) => {
      "worklet";

      cancelAnimation(scale);
      const nextScale = clamp(scale.value * factor, minScale, maxScale);
      scale.value = withTiming(nextScale);
      savedScale.value = nextScale;

      if (onScaleChange) {
        runOnJS(emitScaleChange)(nextScale);
      }
    })(multiplier);
  }, [emitScaleChange, maxScale, minScale, onScaleChange, savedScale, scale]);

  const animateRotationBy = React.useCallback((delta: number) => {
    runOnUI((rotationDelta: number) => {
      "worklet";

      cancelAnimation(rotation);
      const nextRotation = rotation.value + rotationDelta;
      rotation.value = withTiming(nextRotation);
      savedRotation.value = nextRotation;

      if (onRotationChange) {
        runOnJS(emitRotationChange)(nextRotation);
      }
    })(delta);
  }, [emitRotationChange, onRotationChange, rotation, savedRotation]);

  const onPressRotateLeft = () => {
    animateRotationBy(-rotateDegree);
  };

  const onPressRotateRight = () => {
    animateRotationBy(rotateDegree);
  };

  const onPressZoomIn = () => {
    animateScaleBy(zoomFactor);
  };

  const onPressZoomOut = () => {
    animateScaleBy(1 / zoomFactor);
  };

  const pinchGesture = Gesture.Pinch()
    .enabled(enablePinch)
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      const nextScale = clamp(savedScale.value * e.scale, minScale, maxScale);
      scale.value = nextScale;
      if (onScaleChange) {
        runOnJS(emitScaleChange)(nextScale);
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .enabled(enablePan)
    .onStart(() => {
      startTranslateX.value = positionX.value;
      startTranslateY.value = positionY.value;
    })
    .onUpdate((e) => {
      const nextX = startTranslateX.value + e.translationX;
      const nextY = startTranslateY.value + e.translationY;
      positionX.value = nextX;
      positionY.value = nextY;
      if (onPositionChange) {
        runOnJS(emitPositionChange)(nextX, nextY);
      }
    })
    .onEnd(() => {
      const clampedX = clamp(positionX.value, -resolvedBoundaryX, resolvedBoundaryX);
      const clampedY = clamp(positionY.value, -resolvedBoundaryY, resolvedBoundaryY);

      startTranslateX.value = clampedX;
      startTranslateY.value = clampedY;

      if (clampedX !== positionX.value) {
        positionX.value = withTiming(clampedX, { duration: 100 });
      }
      if (clampedY !== positionY.value) {
        positionY.value = withTiming(clampedY, { duration: 100 });
      }

      if (onPositionChange) {
        runOnJS(emitPositionChange)(clampedX, clampedY);
      }
    });

  const rotationGesture = Gesture.Rotation()
    .enabled(enableRotation)
    .onStart(() => {
      savedRotation.value = rotation.value;
    })
    .onUpdate((e) => {
      const nextRotation = savedRotation.value + (e.rotation * 180) / Math.PI;
      rotation.value = nextRotation;
      if (onRotationChange) {
        runOnJS(emitRotationChange)(nextRotation);
      }
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  type SupportedGesture =
    | ReturnType<typeof Gesture.Pinch>
    | ReturnType<typeof Gesture.Pan>
    | ReturnType<typeof Gesture.Rotation>;

  const enabledGestures = [
    enablePinch ? pinchGesture : null,
    enablePan ? panGesture : null,
    enableRotation ? rotationGesture : null,
  ].filter((gesture): gesture is SupportedGesture => gesture !== null);

  const composed = enabledGestures.length > 0
    ? Gesture.Simultaneous(...enabledGestures)
    : Gesture.Tap().enabled(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

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
