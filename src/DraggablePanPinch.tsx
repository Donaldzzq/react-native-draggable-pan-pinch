import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, useWindowDimensions, ViewStyle, View, TouchableOpacity, Text, TextStyle } from "react-native";
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
  reset?: ReactNode;
}

interface ShowActionButtons {
  zoomIn?: boolean;
  zoomOut?: boolean;
  rotateLeft?: boolean;
  rotateRight?: boolean;
  reset?: boolean;
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
  actionButtonIconStyle?: StyleProp<TextStyle>;
  rotateDegree?: number;
  zoomScale?: number;
}

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(max, Math.max(min, value));
};

const hasTransformChanged = (
  nextScale: number,
  nextRotation: number,
  nextX: number,
  nextY: number,
  defaultScale: number,
  defaultRotation: number
) => {
  "worklet";

  return (
    nextScale !== defaultScale ||
    nextRotation !== defaultRotation ||
    nextX !== 0 ||
    nextY !== 0
  );
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
    reset: false,
  },
  actionButtons,
  actionButtonsContainerStyle,
  actionButtonsStyle,
  actionButtonIconStyle,
  rotateDegree = 90,
  zoomScale = 0.5,
}: DraggablePanPinchProps) => {
  const { width, height } = useWindowDimensions();
  const resolvedBoundaryX = boundaryX ?? width / 2;
  const resolvedBoundaryY = boundaryY ?? height / 2;
  const [hasTransformChanges, setHasTransformChanges] = React.useState(false);

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
  const transformChanged = useSharedValue(false);
  const zoomFactor = 1 + zoomScale;

  const syncHasTransformChanges = React.useCallback((nextHasChanges: boolean) => {
    setHasTransformChanges(nextHasChanges);
  }, []);

  const animateScaleBy = React.useCallback((multiplier: number) => {
    runOnUI((factor: number) => {
      "worklet";

      cancelAnimation(scale);
      const nextScale = clamp(scale.value * factor, minScale, maxScale);
      scale.value = withTiming(nextScale);
      savedScale.value = nextScale;

      const nextHasChanges = hasTransformChanged(
        nextScale,
        rotation.value,
        positionX.value,
        positionY.value,
        clampedInitialScale,
        initialRotation
      );
      if (transformChanged.value !== nextHasChanges) {
        transformChanged.value = nextHasChanges;
        runOnJS(syncHasTransformChanges)(nextHasChanges);
      }

      if (onScaleChange) {
        runOnJS(emitScaleChange)(nextScale);
      }
    })(multiplier);
  }, [
    clampedInitialScale,
    emitScaleChange,
    initialRotation,
    maxScale,
    minScale,
    onScaleChange,
    positionX,
    positionY,
    rotation,
    savedScale,
    scale,
    syncHasTransformChanges,
    transformChanged,
  ]);

  const animateRotationBy = React.useCallback((delta: number) => {
    runOnUI((rotationDelta: number) => {
      "worklet";

      cancelAnimation(rotation);
      const nextRotation = rotation.value + rotationDelta;
      rotation.value = withTiming(nextRotation);
      savedRotation.value = nextRotation;

      const nextHasChanges = hasTransformChanged(
        scale.value,
        nextRotation,
        positionX.value,
        positionY.value,
        clampedInitialScale,
        initialRotation
      );
      if (transformChanged.value !== nextHasChanges) {
        transformChanged.value = nextHasChanges;
        runOnJS(syncHasTransformChanges)(nextHasChanges);
      }

      if (onRotationChange) {
        runOnJS(emitRotationChange)(nextRotation);
      }
    })(delta);
  }, [
    clampedInitialScale,
    emitRotationChange,
    initialRotation,
    onRotationChange,
    positionX,
    positionY,
    rotation,
    savedRotation,
    scale,
    syncHasTransformChanges,
    transformChanged,
  ]);

  const resetTransform = React.useCallback(() => {
    runOnUI((defaultScale: number, defaultRotation: number) => {
      "worklet";

      cancelAnimation(scale);
      cancelAnimation(rotation);
      cancelAnimation(positionX);
      cancelAnimation(positionY);

      scale.value = withTiming(defaultScale);
      savedScale.value = defaultScale;
      rotation.value = withTiming(defaultRotation);
      savedRotation.value = defaultRotation;
      positionX.value = withTiming(0, { duration: 100 });
      positionY.value = withTiming(0, { duration: 100 });
      startTranslateX.value = 0;
      startTranslateY.value = 0;

      if (transformChanged.value) {
        transformChanged.value = false;
        runOnJS(syncHasTransformChanges)(false);
      }

      if (onScaleChange) {
        runOnJS(emitScaleChange)(defaultScale);
      }
      if (onPositionChange) {
        runOnJS(emitPositionChange)(0, 0);
      }
      if (onRotationChange) {
        runOnJS(emitRotationChange)(defaultRotation);
      }
    })(clampedInitialScale, initialRotation);
  }, [
    clampedInitialScale,
    emitPositionChange,
    emitRotationChange,
    emitScaleChange,
    initialRotation,
    onPositionChange,
    onRotationChange,
    onScaleChange,
    positionX,
    positionY,
    rotation,
    savedRotation,
    savedScale,
    scale,
    startTranslateX,
    startTranslateY,
    syncHasTransformChanges,
    transformChanged,
  ]);

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

  const onPressReset = () => {
    resetTransform();
  };

  const pinchGesture = Gesture.Pinch()
    .enabled(enablePinch)
    .onStart(() => {
      "worklet";

      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      "worklet";

      const nextScale = clamp(savedScale.value * e.scale, minScale, maxScale);
      scale.value = nextScale;

      const nextHasChanges = hasTransformChanged(
        nextScale,
        rotation.value,
        positionX.value,
        positionY.value,
        clampedInitialScale,
        initialRotation
      );
      if (transformChanged.value !== nextHasChanges) {
        transformChanged.value = nextHasChanges;
        runOnJS(syncHasTransformChanges)(nextHasChanges);
      }

      if (onScaleChange) {
        runOnJS(emitScaleChange)(nextScale);
      }
    })
    .onEnd(() => {
      "worklet";

      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .enabled(enablePan)
    .onStart(() => {
      "worklet";

      startTranslateX.value = positionX.value;
      startTranslateY.value = positionY.value;
    })
    .onUpdate((e) => {
      "worklet";

      const nextX = startTranslateX.value + e.translationX;
      const nextY = startTranslateY.value + e.translationY;
      positionX.value = nextX;
      positionY.value = nextY;

      const nextHasChanges = hasTransformChanged(
        scale.value,
        rotation.value,
        nextX,
        nextY,
        clampedInitialScale,
        initialRotation
      );
      if (transformChanged.value !== nextHasChanges) {
        transformChanged.value = nextHasChanges;
        runOnJS(syncHasTransformChanges)(nextHasChanges);
      }

      if (onPositionChange) {
        runOnJS(emitPositionChange)(nextX, nextY);
      }
    })
    .onEnd(() => {
      "worklet";

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

      const nextHasChanges = hasTransformChanged(
        scale.value,
        rotation.value,
        clampedX,
        clampedY,
        clampedInitialScale,
        initialRotation
      );
      if (transformChanged.value !== nextHasChanges) {
        transformChanged.value = nextHasChanges;
        runOnJS(syncHasTransformChanges)(nextHasChanges);
      }

      if (onPositionChange) {
        runOnJS(emitPositionChange)(clampedX, clampedY);
      }
    });

  const rotationGesture = Gesture.Rotation()
    .enabled(enableRotation)
    .onStart(() => {
      "worklet";

      savedRotation.value = rotation.value;
    })
    .onUpdate((e) => {
      "worklet";

      const nextRotation = savedRotation.value + (e.rotation * 180) / Math.PI;
      rotation.value = nextRotation;

      const nextHasChanges = hasTransformChanged(
        scale.value,
        nextRotation,
        positionX.value,
        positionY.value,
        clampedInitialScale,
        initialRotation
      );
      if (transformChanged.value !== nextHasChanges) {
        transformChanged.value = nextHasChanges;
        runOnJS(syncHasTransformChanges)(nextHasChanges);
      }

      if (onRotationChange) {
        runOnJS(emitRotationChange)(nextRotation);
      }
    })
    .onEnd(() => {
      "worklet";

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

  const showResetButton = showButtons.reset !== false && hasTransformChanges;
  const showActionButtons =
    showResetButton ||
    Boolean(
      enableRotation && (showButtons.rotateLeft || showButtons.rotateRight)
    ) ||
    Boolean(enablePinch && (showButtons.zoomIn || showButtons.zoomOut));

  return (
    <View style={styles.wrapper}>
      {showActionButtons && (
        <View style={[styles.buttonsContainer, actionButtonsContainerStyle]}>
          {enableRotation && showButtons.rotateLeft && (
            <TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressRotateLeft}>
              {actionButtons?.rotateLeft ?? <Text style={[styles.buttonText, actionButtonIconStyle]}>↺</Text>}
            </TouchableOpacity>
          )}
          {enableRotation && showButtons.rotateRight && (
            <TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressRotateRight}>
              {actionButtons?.rotateRight ?? <Text style={[styles.buttonText, actionButtonIconStyle]}>↻</Text>}
            </TouchableOpacity>
          )}
          {enablePinch && showButtons.zoomIn && (
            <TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressZoomIn}>
              {actionButtons?.zoomIn ?? <Text style={[styles.buttonText, actionButtonIconStyle]}>+</Text>}
            </TouchableOpacity>
          )}
          {enablePinch && showButtons.zoomOut && (
            <TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressZoomOut}>
              {actionButtons?.zoomOut ?? <Text style={[styles.buttonText, actionButtonIconStyle]}>-</Text>}
            </TouchableOpacity>
          )}
          {showResetButton && (
            <TouchableOpacity
              accessibilityLabel="Reset image"
              accessibilityRole="button"
              style={[styles.button, actionButtonsStyle]}
              onPress={onPressReset}
            >
              {actionButtons?.reset ?? <Text style={[styles.buttonText, actionButtonIconStyle]}>⟲</Text>}
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
    color: '#000000',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: 'center',
  }
});
