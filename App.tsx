import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { NativeWindStyleSheet } from 'nativewind';

// Enable Tailwind CSS
NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </>
  );
}
