import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera, CameraType } from 'expo-camera';

const HomeScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    Alert.alert(
      'Barcode Scanned', 
      `Type: ${type}\nData: ${data}`,
      [{ text: 'OK', onPress: () => setScanned(false) }]
    );
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={CameraType.back}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  camera: {
    width: '100%',
    height: '75%',
  },
  scanButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;
