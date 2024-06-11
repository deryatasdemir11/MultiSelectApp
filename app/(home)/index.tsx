import { Image, StyleSheet, Text, FlatList, View, ActivityIndicator, Dimensions, TouchableOpacity, TextInput, ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import useAPI from '@/hooks/useAPI';
import NotFoundScreen from '../+not-found';
import { useEffect, useState } from 'react';

export default function HomeScreen() {

  const { characters, loading, error } = useAPI();
  const [data, setData] = useState<any[]>(characters);
  const [checked, setChecked] = useState<number>();
  const [search, setSearch] = useState<string>("");
  const [searchList, setSearchList] = useState<string[]>([]);

  useEffect(() => {
    setData(characters);
  }, [characters, loading, error])


  const handleAdd = () => {
    if (search !== "") {
      setSearchList([...searchList, search]);

      setSearch("");
    }
  };

  const handleDelete = (ix: number) => {

    const updatedList = searchList.filter((_, idx) => idx !== ix); // Gelen index'e göre listeyi düzenleyecek
    setSearchList(updatedList); // Düzenlenen filtreyi Tekrar atayacak
  };

  const filterData = (data: any[], searchList: string[], search: string) => {

    return data.filter((cItem) => {
      for (const searchItem of searchList) {
        if (!cItem.name.toLowerCase().includes(searchItem.toLowerCase())) {
          return false;
        }
      }

      return cItem.name.toLowerCase().includes(search.toLowerCase());
    });

  }

  if (error) {
    return (
      <NotFoundScreen message={`${error}`} />
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ borderWidth: 1, padding: 6, borderRadius: 8, }} >
        <View style={{ flexDirection: 'row', gap: 6, }}>
          {searchList.map((i, ix) => (
            <View key={ix} style={{ flexDirection: 'row', borderRadius: 8, borderWidth: 1, paddingLeft: 12, paddingVertical: 6, gap: 4, paddingRight: 8 }}>
              <Text style={{ alignSelf: 'center' }}>{i}</Text>
              <TouchableOpacity onPress={() => handleDelete(ix)}>
                <Image source={require("../../assets/images/close.png")} style={{ width: 28, height: 28, alignSelf: 'center' }} />
              </TouchableOpacity>

            </View>
          ))}
          <TextInput placeholder='Search...' cursorColor="#000" value={search} onChangeText={setSearch} onSubmitEditing={handleAdd} style={{ width: Dimensions.get('screen').width / 2, paddingVertical: 6, }} />
        </View>

      </ScrollView>
      {loading && <ActivityIndicator size="large" color="#000" style={{}} />}
      <FlatList
        data={data ? filterData(data, searchList, search) : []}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={characters && { borderRadius: 12, borderWidth: characters.length > 0 ? 1 : 0, }}
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
        ListEmptyComponent={() => !loading && <Text>Hello</Text>}
      />

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("screen").height,
    padding: 16,
    gap: 12,
    paddingTop: 38
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
