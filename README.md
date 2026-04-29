# React Native Draggable Pan Pinch

A React Native component for creating draggable, pannable, and pinchable views. Perfect for image viewers, maps, and any interactive UI elements that require gesture controls.

## DEMO on IOS
https://github.com/user-attachments/assets/2b2a6086-816e-4526-b838-9889db5ff7ec

## Features

- 🔄 Pinch to zoom (scaling)
- 🔀 Pan to move
- 🔄 Rotation support
- 🎛️ Customizable boundaries
- 🎮 Enable/disable specific gestures
- 📊 Track gesture state (scale, position, rotation)
- 📱 Works on both iOS and Android

## Installation

```bash
npm install react-native-draggable-pan-pinch
```

### Dependencies

This package requires the following peer dependencies:

```bash
npm install react-native-gesture-handler react-native-reanimated
```

For React Native 0.60 and higher, the linking is automatic. For older versions, you may need to link the libraries:

```bash
react-native link react-native-gesture-handler
react-native link react-native-reanimated
```

For iOS, install the pods:

```bash
cd ios && pod install && cd ..
```

For React Native Reanimated, you may need additional setup. Please refer to the [official documentation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

## Usage with Custom icons

```jsx
import React from 'react';
import { View, Image } from 'react-native';
import { DraggablePanPinch } from 'react-native-draggable-pan-pinch';

const App = () => {
  return (
    <View style={styles.imageWrapper}>
      <DraggablePanPinch
        key={invoice.id}
        style={styles.wholeFlex}
        initialRotation={invoice.rotateDeg || 0}
        minScale={0.5}
        maxScale={5}
        enableRotation={true}
        rotateDegree={90}
        zoomScale={ZOOM_STEP}
        onRotationChange={handleImageRotationChange}
        showButtons={{
          rotateLeft: true,
          rotateRight: true,
          zoomIn: true,
          zoomOut: true,
          reset: true,
        }}
        actionButtons={{
          rotateLeft: renderDraggableActionIcon("rotate-left"),
          rotateRight: renderDraggableActionIcon("rotate-right"),
          zoomIn: renderDraggableActionIcon("plus"),
          zoomOut: renderDraggableActionIcon("minus"),
          reset: renderDraggableActionIcon("backup-restore"),
      }}
      actionButtonsContainerStyle={styles.header}
      actionButtonsStyle={styles.draggableActionButton}
    >
        {(displayOriginalPDF && presignedUrl.length > 0) ? (
          <PdfViewer
            style={styles.wholeFlex}
            source={{ uri: presignedUrl }} />
        ) : imgSrc && imgSrc.length > 0 ? (
          <Image
            resizeMode="contain"
            style={styles.wholeFlex}
            source={{ uri: imgSrc }}
          />
      ) : <View style={styles.wholeFlex} />}
    </DraggablePanPinch>
  </View>
  );
};

export default App;
```

> **Important**: Make sure to wrap your app with `GestureHandlerRootView` as shown in the example.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | (required) | The content to be rendered inside the draggable container |
| `style` | ViewStyle | {} | Additional styles for the container |
| `initialScale` | number | 1 | Initial scale value |
| `initialRotation` | number | 0 | Initial rotation in degrees |
| `maxScale` | number | 5 | Maximum allowed scale |
| `minScale` | number | 0.5 | Minimum allowed scale |
| `boundaryX` | number | SCREEN_WIDTH / 2 | Horizontal boundary for panning |
| `boundaryY` | number | SCREEN_HEIGHT / 2 | Vertical boundary for panning |
| `enablePan` | boolean | true | Enable panning gesture |
| `enablePinch` | boolean | true | Enable pinch gesture for scaling |
| `enableRotation` | boolean | false | Enable rotation gesture |
| `onScaleChange` | (scale: number) => void | undefined | Callback when scale changes |
| `onPositionChange` | (x: number, y: number) => void | undefined | Callback when position changes |
| `onRotationChange` | (rotation: number) => void | undefined | Callback when rotation changes |
| `showButtons.reset` | boolean | false | Show a reset button when the image scale, position, or rotation changes |
| `actionButtons.reset` | ReactNode | ⟲ | Custom reset button content |

## Examples

Check out the [example directory](./example) for a complete example application.

### Image Viewer

```jsx
import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';
import { DraggablePanPinch } from 'react-native-draggable-pan-pinch';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ImageViewer = () => {
  const [scale, setScale] = useState(1);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ padding: 10 }}>Scale: {scale.toFixed(2)}x</Text>
        <DraggablePanPinch
          onScaleChange={setScale}
          style={{ flex: 1 }}
        >
          <Image
            source={{ uri: 'https://picsum.photos/600/400' }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </DraggablePanPinch>
      </View>
    </GestureHandlerRootView>
  );
};
```

## Development

### Local Testing

To test the package locally:

```bash
npm run test-local
```

This will guide you through the process of linking the package to a test project.

### Publishing

To publish the package to npm:

```bash
npm run publish-package
```

This will guide you through the process of updating the version, building the package, and publishing it.

## License

MIT
