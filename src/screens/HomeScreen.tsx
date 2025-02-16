import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  BarcodeScanner: undefined;
  History: undefined;
  Settings: undefined;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();

  const MenuButton = ({ 
    title, 
    onPress, 
    backgroundColor = '#3b82f6' 
  }: { 
    title: string, 
    onPress: () => void, 
    backgroundColor?: string 
  }) => (
    <TouchableOpacity 
      style={[styles.menuButton, { backgroundColor }]} 
      onPress={onPress}
    >
      <Text style={styles.menuButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Barcoder</Text>
        <Text style={styles.headerSubtitle}>Your Barcode Companion</Text>
      </View>

      <View style={styles.menuContainer}>
        <MenuButton 
          title="Scan Barcode" 
          onPress={() => navigation.navigate('BarcodeScanner')} 
        />
        <MenuButton 
          title="Scan History" 
          onPress={() => navigation.navigate('History')}
          backgroundColor="#10b981" 
        />
        <MenuButton 
          title="Settings" 
          onPress={() => navigation.navigate('Settings')}
          backgroundColor="#f43f5e" 
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Easily scan and track barcodes with just a tap!
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  menuContainer: {
    width: '80%',
    gap: 20,
  },
  menuButton: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    color: '#7f8c8d',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
