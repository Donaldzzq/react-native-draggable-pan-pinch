import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, SafeAreaView } from 'react-native';
import { DraggablePanPinch } from 'react-native-draggable-pan-pinch';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [enablePan, setEnablePan] = useState(true);
  const [enablePinch, setEnablePinch] = useState(true);
  const [enableRotation, setEnableRotation] = useState(false);

  // Sample image URL - replace with your own image
  const imageUrl = 'https://picsum.photos/600/400';

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>React Native Draggable Pan Pinch</Text>
        </View>

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

        <View style={styles.infoContainer}>
          <Text>Scale: {scale.toFixed(2)}</Text>
          <Text>Position: {position.x.toFixed(0)}, {position.y.toFixed(0)}</Text>
          <Text>Rotation: {rotation.toFixed(0)}°</Text>
        </View>

        <View style={styles.imageContainer}>
          <DraggablePanPinch
            enablePan={enablePan}
            enablePinch={enablePinch}
            enableRotation={enableRotation}
            maxScale={5}
            minScale={0.5}
            onScaleChange={setScale}
            onPositionChange={(x, y) => setPosition({ x, y })}
            onRotationChange={setRotation}
            style={styles.draggableContainer}
          >
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </DraggablePanPinch>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  infoContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    margin: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  draggableContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default App;
