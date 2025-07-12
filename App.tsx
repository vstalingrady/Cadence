import React from 'react';
import { StatusBar } from 'react-native';
import WelcomeScreen from '~/screens/WelcomeScreen';

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <WelcomeScreen />
    </>
  );
}

export default App;
