"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraggablePanPinch = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const react_native_reanimated_2 = __importStar(require("react-native-reanimated"));
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = react_native_1.Dimensions.get("window");
const DraggablePanPinch = ({ children, style, initialScale = 1, initialRotation = 0, maxScale = 5, minScale = 0.5, boundaryX = SCREEN_WIDTH / 2, boundaryY = SCREEN_HEIGHT / 2, enablePan = true, enablePinch = true, enableRotation = false, onScaleChange, onPositionChange, onRotationChange, }) => {
    // Shared values for animations
    const scale = (0, react_native_reanimated_2.useSharedValue)(initialScale);
    const savedScale = (0, react_native_reanimated_2.useSharedValue)(initialScale);
    const rotation = (0, react_native_reanimated_2.useSharedValue)(initialRotation);
    const savedRotation = (0, react_native_reanimated_2.useSharedValue)(initialRotation);
    const positionX = (0, react_native_reanimated_2.useSharedValue)(0);
    const positionY = (0, react_native_reanimated_2.useSharedValue)(0);
    const startTranslateX = (0, react_native_reanimated_2.useSharedValue)(0);
    const startTranslateY = (0, react_native_reanimated_2.useSharedValue)(0);
    // Pinch gesture for scaling
    const pinchGesture = react_native_gesture_handler_1.Gesture.Pinch()
        .enabled(enablePinch)
        .onUpdate((e) => {
        const newScale = savedScale.value * e.scale;
        // Limit scale between minScale and maxScale
        scale.value = Math.max(minScale, Math.min(maxScale, newScale));
        onScaleChange === null || onScaleChange === void 0 ? void 0 : onScaleChange(scale.value);
    })
        .onEnd(() => {
        savedScale.value = scale.value;
    });
    // Pan gesture for moving
    const panGesture = react_native_gesture_handler_1.Gesture.Pan()
        .enabled(enablePan)
        .onUpdate((e) => {
        positionX.value = startTranslateX.value + e.translationX;
        positionY.value = startTranslateY.value + e.translationY;
        onPositionChange === null || onPositionChange === void 0 ? void 0 : onPositionChange(positionX.value, positionY.value);
    })
        .onEnd(() => {
        // Check if the view is out of bounds
        if (Math.abs(positionX.value) > boundaryX) {
            positionX.value = (0, react_native_reanimated_1.withTiming)(boundaryX * (positionX.value > 0 ? 1 : -1), { duration: 100 });
        }
        else {
            startTranslateX.value = positionX.value;
        }
        if (Math.abs(positionY.value) > boundaryY) {
            positionY.value = (0, react_native_reanimated_1.withTiming)(boundaryY * (positionY.value > 0 ? 1 : -1), { duration: 100 });
        }
        else {
            startTranslateY.value = positionY.value;
        }
        onPositionChange === null || onPositionChange === void 0 ? void 0 : onPositionChange(positionX.value, positionY.value);
    });
    // Rotation gesture
    const rotationGesture = react_native_gesture_handler_1.Gesture.Rotation()
        .enabled(enableRotation)
        .onUpdate((e) => {
        rotation.value = savedRotation.value + e.rotation * 180 / Math.PI;
        onRotationChange === null || onRotationChange === void 0 ? void 0 : onRotationChange(rotation.value);
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
    const enabledGestures = gesturesArray.filter(Boolean);
    // Default to a simple tap gesture if no gestures are enabled
    // This prevents an error when spreading an empty array into Gesture.Race()
    const composed = enabledGestures.length > 0
        ? react_native_gesture_handler_1.Gesture.Race(...enabledGestures)
        : react_native_gesture_handler_1.Gesture.Tap().enabled(false); // Disabled tap gesture as fallback
    // Animated styles for transformations
    const animatedStyle = (0, react_native_reanimated_2.useAnimatedStyle)(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` },
            { translateX: positionX.value },
            { translateY: positionY.value },
        ],
    }));
    return (<react_native_gesture_handler_1.GestureDetector gesture={composed}>
      <react_native_reanimated_2.default.View style={[styles.container, style, animatedStyle]}>
        {children}
      </react_native_reanimated_2.default.View>
    </react_native_gesture_handler_1.GestureDetector>);
};
exports.DraggablePanPinch = DraggablePanPinch;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
});
