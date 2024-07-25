import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false , title:""}} />
        <Stack.Screen name="project-details" options={{ title: "" }} />
      </Stack>
    </Provider>
  );
}