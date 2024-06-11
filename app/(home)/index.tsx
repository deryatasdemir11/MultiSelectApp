import { Image, StyleSheet, Text, FlatList, View, ActivityIndicator, type ActivityIndicatorProps, Dimensions, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import useAPI from '@/hooks/useAPI';
import NotFoundScreen from '../+not-found';
import { CheckBox, Icon } from '@rneui/themed';
import { useState } from 'react';

export default function HomeScreen() {

  const { characters, loading, error } = useAPI();

  const [checked, setChecked] = useState(null);

  const [search, setSearch] = useState("ric");

  if (error) {
    return (
      <NotFoundScreen message={`${error}`} />
    )
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={characters}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={characters && { borderRadius: 12, borderWidth: characters.length > 0 ? 1 : 0 }}
        renderItem={({ item }) => (
          <View style={{ padding: 12, flexDirection: 'row', gap: 16, borderBottomWidth: item === characters[characters.length - 1] ? 0 : 1 }}>
            <TouchableOpacity onPress={() => setChecked(item.id)} style={{ justifyContent: 'center' }}>
              <Image source={item.id === checked ? require("../../assets/images/checked.png") : require("../../assets/images/unchecked.png")} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
            <Image style={{ width: 50, height: 50, borderRadius: 8 }} source={{
              uri: item.image,
            }} />
            <View style={styles.titleContainer}>
              <Text style={{ fontSize: 16, fontWeight: 'normal' }} numberOfLines={1}>{item.name}</Text>
              <Text numberOfLines={1}>{`${item.episode.length} Episodes`} </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => <ActivityIndicator size="large" color="#000" style={{ height: Dimensions.get('screen').height }} />}
      />

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    paddingTop: 42
  },
  iconContainer: {
    justifyContent: 'center',
    flex: 1
  },
  titleContainer: {
    gap: 6,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
