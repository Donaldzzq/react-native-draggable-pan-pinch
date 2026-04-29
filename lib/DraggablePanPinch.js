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
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const clamp = (value, min, max) => {
    "worklet";
    return Math.min(max, Math.max(min, value));
};
const DraggablePanPinch = ({ children, style, initialScale = 1, initialRotation = 0, maxScale = 5, minScale = 0.5, boundaryX, boundaryY, enablePan = true, enablePinch = true, enableRotation = false, onScaleChange, onPositionChange, onRotationChange, showButtons = {
    zoomIn: false,
    zoomOut: false,
    rotateLeft: false,
    rotateRight: false,
}, actionButtons, actionButtonsContainerStyle, actionButtonsStyle, rotateDegree = 90, zoomScale = 0.5, }) => {
    var _a, _b, _c, _d;
    const { width, height } = (0, react_native_1.useWindowDimensions)();
    const resolvedBoundaryX = boundaryX !== null && boundaryX !== void 0 ? boundaryX : width / 2;
    const resolvedBoundaryY = boundaryY !== null && boundaryY !== void 0 ? boundaryY : height / 2;
    const emitScaleChange = react_1.default.useCallback((nextScale) => {
        onScaleChange === null || onScaleChange === void 0 ? void 0 : onScaleChange(nextScale);
    }, [onScaleChange]);
    const emitPositionChange = react_1.default.useCallback((x, y) => {
        onPositionChange === null || onPositionChange === void 0 ? void 0 : onPositionChange(x, y);
    }, [onPositionChange]);
    const emitRotationChange = react_1.default.useCallback((nextRotation) => {
        onRotationChange === null || onRotationChange === void 0 ? void 0 : onRotationChange(nextRotation);
    }, [onRotationChange]);
    const clampedInitialScale = clamp(initialScale, minScale, maxScale);
    const scale = (0, react_native_reanimated_1.useSharedValue)(clampedInitialScale);
    const savedScale = (0, react_native_reanimated_1.useSharedValue)(clampedInitialScale);
    const rotation = (0, react_native_reanimated_1.useSharedValue)(initialRotation);
    const savedRotation = (0, react_native_reanimated_1.useSharedValue)(initialRotation);
    const positionX = (0, react_native_reanimated_1.useSharedValue)(0);
    const positionY = (0, react_native_reanimated_1.useSharedValue)(0);
    const startTranslateX = (0, react_native_reanimated_1.useSharedValue)(0);
    const startTranslateY = (0, react_native_reanimated_1.useSharedValue)(0);
    const zoomFactor = 1 + zoomScale;
    const animateScaleBy = react_1.default.useCallback((multiplier) => {
        (0, react_native_reanimated_1.runOnUI)((factor) => {
            "worklet";
            (0, react_native_reanimated_1.cancelAnimation)(scale);
            const nextScale = clamp(scale.value * factor, minScale, maxScale);
            scale.value = (0, react_native_reanimated_1.withTiming)(nextScale);
            savedScale.value = nextScale;
            if (onScaleChange) {
                (0, react_native_reanimated_1.runOnJS)(emitScaleChange)(nextScale);
            }
        })(multiplier);
    }, [emitScaleChange, maxScale, minScale, onScaleChange, savedScale, scale]);
    const animateRotationBy = react_1.default.useCallback((delta) => {
        (0, react_native_reanimated_1.runOnUI)((rotationDelta) => {
            "worklet";
            (0, react_native_reanimated_1.cancelAnimation)(rotation);
            const nextRotation = rotation.value + rotationDelta;
            rotation.value = (0, react_native_reanimated_1.withTiming)(nextRotation);
            savedRotation.value = nextRotation;
            if (onRotationChange) {
                (0, react_native_reanimated_1.runOnJS)(emitRotationChange)(nextRotation);
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
    const pinchGesture = react_native_gesture_handler_1.Gesture.Pinch()
        .enabled(enablePinch)
        .onStart(() => {
        savedScale.value = scale.value;
    })
        .onUpdate((e) => {
        const nextScale = clamp(savedScale.value * e.scale, minScale, maxScale);
        scale.value = nextScale;
        if (onScaleChange) {
            (0, react_native_reanimated_1.runOnJS)(emitScaleChange)(nextScale);
        }
    })
        .onEnd(() => {
        savedScale.value = scale.value;
    });
    const panGesture = react_native_gesture_handler_1.Gesture.Pan()
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
            (0, react_native_reanimated_1.runOnJS)(emitPositionChange)(nextX, nextY);
        }
    })
        .onEnd(() => {
        const clampedX = clamp(positionX.value, -resolvedBoundaryX, resolvedBoundaryX);
        const clampedY = clamp(positionY.value, -resolvedBoundaryY, resolvedBoundaryY);
        startTranslateX.value = clampedX;
        startTranslateY.value = clampedY;
        if (clampedX !== positionX.value) {
            positionX.value = (0, react_native_reanimated_1.withTiming)(clampedX, { duration: 100 });
        }
        if (clampedY !== positionY.value) {
            positionY.value = (0, react_native_reanimated_1.withTiming)(clampedY, { duration: 100 });
        }
        if (onPositionChange) {
            (0, react_native_reanimated_1.runOnJS)(emitPositionChange)(clampedX, clampedY);
        }
    });
    const rotationGesture = react_native_gesture_handler_1.Gesture.Rotation()
        .enabled(enableRotation)
        .onStart(() => {
        savedRotation.value = rotation.value;
    })
        .onUpdate((e) => {
        const nextRotation = savedRotation.value + (e.rotation * 180) / Math.PI;
        rotation.value = nextRotation;
        if (onRotationChange) {
            (0, react_native_reanimated_1.runOnJS)(emitRotationChange)(nextRotation);
        }
    })
        .onEnd(() => {
        savedRotation.value = rotation.value;
    });
    const enabledGestures = [
        enablePinch ? pinchGesture : null,
        enablePan ? panGesture : null,
        enableRotation ? rotationGesture : null,
    ].filter((gesture) => gesture !== null);
    const composed = enabledGestures.length > 0
        ? react_native_gesture_handler_1.Gesture.Simultaneous(...enabledGestures)
        : react_native_gesture_handler_1.Gesture.Tap().enabled(false);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` },
            { translateX: positionX.value },
            { translateY: positionY.value },
        ],
    }));
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
        <react_native_reanimated_1.default.View style={[styles.container, style, animatedStyle]}>
          {children}
        </react_native_reanimated_1.default.View>
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
