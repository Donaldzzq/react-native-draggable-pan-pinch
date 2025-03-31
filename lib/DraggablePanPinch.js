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
const DraggablePanPinch = ({ children, style, initialScale = 1, initialRotation = 0, maxScale = 5, minScale = 0.5, boundaryX = SCREEN_WIDTH / 2, boundaryY = SCREEN_HEIGHT / 2, enablePan = true, enablePinch = true, enableRotation = false, onScaleChange, onPositionChange, onRotationChange, showButtons = {
    zoomIn: false,
    zoomOut: false,
    rotateLeft: false,
    rotateRight: false,
}, actionButtons, actionButtonsContainerStyle, actionButtonsStyle, rotateDegree = 90, zoomScale = 0.5, }) => {
    var _a, _b, _c, _d;
    const [rotation, setRotation] = react_1.default.useState(initialRotation);
    // Shared values for animations
    const scale = (0, react_native_reanimated_2.useSharedValue)(initialScale);
    const savedScale = (0, react_native_reanimated_2.useSharedValue)(initialScale);
    const positionX = (0, react_native_reanimated_2.useSharedValue)(0);
    const positionY = (0, react_native_reanimated_2.useSharedValue)(0);
    const startTranslateX = (0, react_native_reanimated_2.useSharedValue)(0);
    const startTranslateY = (0, react_native_reanimated_2.useSharedValue)(0);
    const onPressRotateLeft = () => {
        const value = rotation - rotateDegree;
        setRotation(value);
        onRotationChange === null || onRotationChange === void 0 ? void 0 : onRotationChange(value);
    };
    const onPressRotateRight = () => {
        const value = rotation + rotateDegree;
        setRotation(value);
        onRotationChange === null || onRotationChange === void 0 ? void 0 : onRotationChange(value);
    };
    const onPressZoomIn = () => {
        scale.value = savedScale.value * (1 + zoomScale);
        onScaleChange === null || onScaleChange === void 0 ? void 0 : onScaleChange(scale.value);
    };
    const onPressZoomOut = () => {
        scale.value = savedScale.value * (1 - zoomScale);
        onScaleChange === null || onScaleChange === void 0 ? void 0 : onScaleChange(scale.value);
    };
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
    // Combine gestures based on what's enabled
    const gesturesArray = [
        enablePinch ? pinchGesture : null,
        enablePan ? panGesture : null,
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
            { rotate: `${rotation}deg` },
            { translateX: positionX.value },
            { translateY: positionY.value },
        ],
    }));
    //check if the action buttons are enabled
    const showActionButtons = Object.values(showButtons).some((value) => value);
    return (<react_native_1.View style={styles.wrapper}>
      {showActionButtons && (<react_native_1.View style={[styles.buttonsContainer, actionButtonsContainerStyle]}>
          {enableRotation && showButtons.rotateLeft && (<react_native_1.TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressRotateLeft}>
              {(_a = actionButtons === null || actionButtons === void 0 ? void 0 : actionButtons.rotateLeft) !== null && _a !== void 0 ? _a : <react_native_1.Text style={styles.buttonText}>↺</react_native_1.Text>}
            </react_native_1.TouchableOpacity>)}
          {enableRotation && showButtons.rotateRight && (<react_native_1.TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressRotateRight}>
              {(_b = actionButtons === null || actionButtons === void 0 ? void 0 : actionButtons.rotateRight) !== null && _b !== void 0 ? _b : <react_native_1.Text style={styles.buttonText}>↻</react_native_1.Text>}
            </react_native_1.TouchableOpacity>)}
          {enablePinch && showButtons.zoomIn && (<react_native_1.TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressZoomIn}>
              {(_c = actionButtons === null || actionButtons === void 0 ? void 0 : actionButtons.zoomIn) !== null && _c !== void 0 ? _c : <react_native_1.Text style={styles.buttonText}>+</react_native_1.Text>}
            </react_native_1.TouchableOpacity>)}
          {enablePinch && showButtons.zoomOut && (<react_native_1.TouchableOpacity style={[styles.button, actionButtonsStyle]} onPress={onPressZoomOut}>
              {(_d = actionButtons === null || actionButtons === void 0 ? void 0 : actionButtons.zoomOut) !== null && _d !== void 0 ? _d : <react_native_1.Text style={styles.buttonText}>-</react_native_1.Text>}
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>)}
      <react_native_gesture_handler_1.GestureDetector gesture={composed}>
        <react_native_reanimated_2.default.View style={[styles.container, style, animatedStyle]}>
          {children}
        </react_native_reanimated_2.default.View>
      </react_native_gesture_handler_1.GestureDetector>
    </react_native_1.View>);
};
exports.DraggablePanPinch = DraggablePanPinch;
const styles = react_native_1.StyleSheet.create({
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
