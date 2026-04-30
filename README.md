
# React Native Draggable Pan Pinch

A lightweight React Native component for wrapping content with pan, pinch-to-zoom, and optional rotation gestures. It is a good fit for image viewers, document previews, maps, diagrams, and any UI that needs direct manipulation.

## Demo

| iOS | Android |
| --- | --- |
| <img width="280" alt="iOS demo" src="https://github.com/user-attachments/assets/f80f7c91-4613-4bea-9142-de932528142b" /> | <img width="280" alt="Android demo" src="https://github.com/user-attachments/assets/904160af-4afa-4a84-b399-4b2f236b2d4d" /> |

## Features

- Pan content with configurable X/Y boundaries.
- Pinch to zoom with minimum and maximum scale limits.
- Rotate with two-finger gestures when enabled.
- Show optional zoom, rotate, and reset action buttons.
- Replace the built-in action button labels with your own icons.
- Track scale, position, and rotation changes with callbacks.
- Works on iOS and Android through React Native Gesture Handler and Reanimated.

## Installation

```bash
npm install react-native-draggable-pan-pinch
```

Install the required peer dependencies if they are not already in your app:

```bash
npm install react-native-gesture-handler react-native-reanimated
```

For iOS, install pods after adding the dependencies:

```bash
cd ios && pod install
```

This package depends on the standard setup for React Native Gesture Handler and React Native Reanimated. Make sure your app is wrapped in `GestureHandlerRootView`, and follow the Reanimated installation steps for your React Native version:

- [React Native Gesture Handler installation](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation)
- [React Native Reanimated installation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)

## Quick Start

```tsx
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DraggablePanPinch } from 'react-native-draggable-pan-pinch';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.screen}>
      <DraggablePanPinch style={styles.viewer} minScale={0.5} maxScale={5}>
        <Image
          source={{ uri: 'https://picsum.photos/900/600' }}
          resizeMode="contain"
          style={styles.image}
        />
      </DraggablePanPinch>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  viewer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
```

## Tracking Gesture State

Use the callbacks when the parent screen needs to display or persist the current transform.

```tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { DraggablePanPinch } from 'react-native-draggable-pan-pinch';

export function ImageViewer({ imageUri }: { imageUri: string }) {
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [rotation, setRotation] = React.useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.status}>
        <Text>Scale: {scale.toFixed(2)}x</Text>
        <Text>
          Position: {position.x.toFixed(0)}, {position.y.toFixed(0)}
        </Text>
        <Text>Rotation: {rotation.toFixed(0)} deg</Text>
      </View>

      <DraggablePanPinch
        enableRotation
        onScaleChange={setScale}
        onPositionChange={(x, y) => setPosition({ x, y })}
        onRotationChange={setRotation}
        style={styles.viewer}
      >
        <Image source={{ uri: imageUri }} resizeMode="contain" style={styles.image} />
      </DraggablePanPinch>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  status: {
    padding: 12,
  },
  viewer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
```

## Action Buttons

Gesture controls can also be exposed as buttons. The reset button only appears after scale, position, or rotation has changed.

```tsx
<DraggablePanPinch
  enableRotation
  rotateDegree={90}
  zoomScale={0.5}
  showButtons={{
    rotateLeft: true,
    rotateRight: true,
    zoomIn: true,
    zoomOut: true,
    reset: true,
  }}
>
  {content}
</DraggablePanPinch>
```

You can replace any built-in button label with your own React node:

```tsx
<DraggablePanPinch
  enableRotation
  showButtons={{ rotateLeft: true, rotateRight: true, reset: true }}
  actionButtons={{
    rotateLeft: <Icon name="rotate-left" />,
    rotateRight: <Icon name="rotate-right" />,
    reset: <Icon name="refresh" />,
  }}
  actionButtonsContainerStyle={styles.toolbar}
  actionButtonsStyle={styles.toolbarButton}
  actionButtonIconStyle={styles.toolbarButtonText}
>
  {content}
</DraggablePanPinch>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | Required | Content rendered inside the animated gesture container. |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Style applied to the animated content container. |
| `initialScale` | `number` | `1` | Starting scale. Values are clamped between `minScale` and `maxScale`. |
| `initialRotation` | `number` | `0` | Starting rotation in degrees. |
| `maxScale` | `number` | `5` | Maximum scale allowed by pinch gestures and zoom buttons. |
| `minScale` | `number` | `0.5` | Minimum scale allowed by pinch gestures and zoom buttons. |
| `boundaryX` | `number` | `windowWidth / 2` | Horizontal pan boundary. The final X position is clamped between `-boundaryX` and `boundaryX`. |
| `boundaryY` | `number` | `windowHeight / 2` | Vertical pan boundary. The final Y position is clamped between `-boundaryY` and `boundaryY`. |
| `enablePan` | `boolean` | `true` | Enables drag/pan gestures. |
| `enablePinch` | `boolean` | `true` | Enables pinch gestures and zoom action buttons. |
| `enableRotation` | `boolean` | `false` | Enables rotation gestures and rotate action buttons. |
| `onScaleChange` | `(scale: number) => void` | `undefined` | Called when scale changes. |
| `onPositionChange` | `(x: number, y: number) => void` | `undefined` | Called when pan position changes. |
| `onRotationChange` | `(rotation: number) => void` | `undefined` | Called when rotation changes. |
| `showButtons` | `ShowActionButtons` | All `false` | Controls visibility for `zoomIn`, `zoomOut`, `rotateLeft`, `rotateRight`, and `reset`. |
| `actionButtons` | `ActionButtons` | Built-in labels | Replaces the built-in button content for any action. |
| `actionButtonsContainerStyle` | `StyleProp<ViewStyle>` | `undefined` | Style override for the action button container. |
| `actionButtonsStyle` | `StyleProp<ViewStyle>` | `undefined` | Style override for each action button. |
| `actionButtonIconStyle` | `StyleProp<TextStyle>` | `undefined` | Style override for the built-in text labels. |
| `rotateDegree` | `number` | `90` | Degrees added or removed when pressing rotate buttons. |
| `zoomScale` | `number` | `0.5` | Zoom button step. `0.5` means zoom in by `1.5x` and zoom out by `1 / 1.5x`. |

### `showButtons`

```ts
type ShowActionButtons = {
  zoomIn?: boolean;
  zoomOut?: boolean;
  rotateLeft?: boolean;
  rotateRight?: boolean;
  reset?: boolean;
};
```

### `actionButtons`

```ts
type ActionButtons = {
  zoomIn?: React.ReactNode;
  zoomOut?: React.ReactNode;
  rotateLeft?: React.ReactNode;
  rotateRight?: React.ReactNode;
  reset?: React.ReactNode;
};
```

## Notes

- `DraggablePanPinch` composes enabled gestures simultaneously, so pan, pinch, and rotation can work together.
- Pan boundaries are applied when the pan gesture ends, with a short timing animation back into range.
- Rotate buttons are only shown when `enableRotation` is `true`.
- Zoom buttons are only shown when `enablePinch` is `true`.
- The reset button returns scale, rotation, and position to their initial values.

## Example App

See the [example directory](./example) for a complete React Native example that toggles gestures and displays the current transform values.

## Development

Install dependencies:

```bash
npm install
```

Build the package:

```bash
npm run build
```

Run the local package linking helper:

```bash
npm run test-local
```

Publish with the release helper:

```bash
npm run publish-package
```

## License

MIT
