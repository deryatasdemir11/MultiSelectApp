import { Image, StyleSheet, Text, FlatList, View, ActivityIndicator, type ActivityIndicatorProps, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import useAPI from '@/hooks/useAPI';
import NotFoundScreen from '../+not-found';
import { useState } from 'react';

export default function HomeScreen() {

  const { characters, loading, error } = useAPI();

  const [checked, setChecked] = useState<number>();

  const [search, setSearch] = useState<string>("");

  const [searchList, setSearchList] = useState<string[]>([]);


  const handleSearchPress = () => {
      if(search !== "") {
        setSearchList([...searchList, search]);

        setSearch("");
      }
  };


  if (error) {
    return (
      <NotFoundScreen message={`${error}`} />
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ borderWidth: 1, padding: 6, borderRadius: 8 }} >
        <View style={{ flexDirection: 'row', gap: 6, }}>
          {searchList.map((i, ix) => (
            <View key={ix} style={{ flexDirection: 'row', borderRadius: 8, borderWidth: 1, paddingLeft: 12, paddingVertical: 6, gap: 4, paddingRight: 8 }}>
              <Text style={{ alignSelf: 'center' }}>{i}</Text>
              <Image source={require("../../assets/images/close.png")} style={{ width: 28, height: 28, alignSelf: 'center' }} />

            </View>
          ))}
          <TextInput placeholder='Search...' cursorColor="#000" value={search} onChangeText={setSearch} onSubmitEditing={handleSearchPress} />
        </View>

      </ScrollView>
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
    gap: 12,
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
