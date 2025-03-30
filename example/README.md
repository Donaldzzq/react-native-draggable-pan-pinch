# Example App for react-native-draggable-pan-pinch

This is an example React Native application that demonstrates how to use the `react-native-draggable-pan-pinch` package.

## Setup

1. Create a new React Native project:

```bash
npx react-native init DraggablePanPinchExample
cd DraggablePanPinchExample
```

2. Install the required dependencies:

```bash
npm install react-native-draggable-pan-pinch
npm install react-native-gesture-handler react-native-reanimated
```

3. For React Native 0.60 and higher, the linking is automatic. For older versions, you may need to link the libraries:

```bash
react-native link react-native-gesture-handler
react-native link react-native-reanimated
```

4. For iOS, install the pods:

```bash
cd ios && pod install && cd ..
```

5. Copy the `App.tsx` file from this directory to your project.

6. Run the application:

```bash
npx react-native run-ios
# or
npx react-native run-android
```

## Important Notes

1. Make sure to wrap your app with `GestureHandlerRootView` as shown in the example.
2. For React Native Reanimated, you may need additional setup. Please refer to the [official documentation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

## Features Demonstrated

- Pinch to zoom (scaling)
- Pan to move
- Rotation
- Enabling/disabling gestures
- Tracking gesture state (scale, position, rotation)

## Customization

You can customize the component by adjusting the props:

- `initialScale`: Initial scale value (default: 1)
- `initialRotation`: Initial rotation in degrees (default: 0)
- `maxScale`: Maximum allowed scale (default: 5)
- `minScale`: Minimum allowed scale (default: 0.5)
- `boundaryX`: Horizontal boundary for panning (default: SCREEN_WIDTH / 2)
- `boundaryY`: Vertical boundary for panning (default: SCREEN_HEIGHT / 2)
- `enablePan`: Enable panning gesture (default: true)
- `enablePinch`: Enable pinch gesture for scaling (default: true)
- `enableRotation`: Enable rotation gesture (default: false)
