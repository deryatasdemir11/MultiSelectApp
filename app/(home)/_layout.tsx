import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function HomeLayout() {
  return (
    <Stack >
        <Stack.Screen name='index' options={{ headerShown: false}} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
