import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '@/store';
import { RootNavigator } from '@/navigation/RootNavigator';
import { tokenManager } from '@/lib/tokenManager';

const App: React.FC = () => {
  useEffect(() => {
    tokenManager.hydrate();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#F3F6ED" />
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
