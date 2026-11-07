import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import DemoStorage from './DemoStorage';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <DemoStorage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});