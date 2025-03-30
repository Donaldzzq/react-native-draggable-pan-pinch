import React from 'react';
import { View, Image, StyleSheet, Button } from 'react-native';
import { DraggablePanPinch } from 'react-native-draggable-pan-pinch';

interface ImageViewerProps {
  imageUri: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUri }) => {
  const [enablePan, setEnablePan] = React.useState(true);
  const [enablePinch, setEnablePinch] = React.useState(true);
  const [enableRotation, setEnableRotation] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button
          title={enablePan ? "Disable Pan" : "Enable Pan"}
          onPress={() => setEnablePan(!enablePan)}
        />
        <Button
          title={enablePinch ? "Disable Pinch" : "Enable Pinch"}
          onPress={() => setEnablePinch(!enablePinch)}
        />
        <Button
          title={enableRotation ? "Disable Rotation" : "Enable Rotation"}
          onPress={() => setEnableRotation(!enableRotation)}
        />
      </View>
      
      <DraggablePanPinch
        enablePan={enablePan}
        enablePinch={enablePinch}
        enableRotation={enableRotation}
        maxScale={5}
        minScale={0.5}
        style={styles.draggableContainer}
        onScaleChange={(scale) => console.log('Scale:', scale)}
        onPositionChange={(x, y) => console.log('Position:', x, y)}
        onRotationChange={(rotation) => console.log('Rotation:', rotation)}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </DraggablePanPinch>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  draggableContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageViewer;
