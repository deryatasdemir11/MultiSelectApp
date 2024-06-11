import { Image, StyleSheet, Text, FlatList, View, ActivityIndicator, Dimensions, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import useAPI from '@/hooks/useAPI';
import NotFoundScreen from '../+not-found';
import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {

  const { characters, loading, error } = useAPI();
  const [data, setData] = useState<any[]>(characters);
  const [checkedList, setCheckedList] = useState<number[]>([]);
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

    const filteredResults = [];

    if(!data) {
      return [];
    }

    if ( search === "" && searchList.length === 0){
      return data;
    }

    if(search !== "") {
      const filteredSearchData =data.filter((cItem) => {
        return cItem.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) 
      });

      filteredResults.push(...filteredSearchData)
    }
    
    for (const searchItem of searchList) {
      
      const filteredSearchListData = data.filter((cItem) => {
        if(cItem.name.toLocaleLowerCase().includes(searchItem.toLocaleLowerCase())) {
          return true;
        }
        

        return false;
      });

      

      filteredResults.push(...filteredSearchListData);
      
    }


    const matchingResult = filteredResults.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    return matchingResult;

  }

  // checked Characters Function
  const selectedAdd = (id: number) => {

    if (checkedList.includes(id)) {
      const updatedCheckedList = checkedList.filter((itemId) => itemId !== id);

      setCheckedList(updatedCheckedList);

    } else {

      const updatedCheckedList = [...checkedList, id];

      setCheckedList(updatedCheckedList);
    }

  }

  const renderTextWithHighlight = (item: string, search: string) => {
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = item.split(regex);
  
    return parts.map((part, index) => {
      if (part.toLowerCase() === search.toLowerCase()) {
        return <Text key={index} style={{ fontWeight: 'bold', }}>{part}</Text>;
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  if (error) {
    return (
      <NotFoundScreen message={`${error}`} />
    )
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior='padding' style={{}} >

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ borderWidth: 1, borderRadius: 8, padding: 6 }} >
          <View style={{ flexDirection: 'row', gap: 6, }}>
            {searchList.map((i, ix) => (
              <View key={ix} style={{ flexDirection: 'row', borderRadius: 8, borderWidth: 1, paddingLeft: 12, gap: 4, paddingRight: 8 }}>
                <Text style={{ alignSelf: 'center' }}>{i}</Text>
                <TouchableOpacity onPress={() => handleDelete(ix)} style={{ paddingTop: 4 }}>
                  <Image source={require("../../assets/images/close.png")} style={{ width: 28, height: 28, }} />
                </TouchableOpacity>

              </View>
            ))}
            <TextInput placeholder='Search...' cursorColor="#000" value={search} onChangeText={setSearch} onSubmitEditing={handleAdd} style={{ width: Dimensions.get('screen').width / 2, paddingVertical: 6, }} />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {loading && <ActivityIndicator size="large" color="#000" style={{}} />}
      <FlatList
        data={filterData(data, searchList, search)}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ 
          borderRadius: filterData(data, searchList,search).length > 0 ? 12 : 0,
          borderWidth: filterData(data, searchList, search).length > 0 ? 1 : 0 
         }}
        renderItem={({ item, index }) => (
          <View style={{ padding: 12, flexDirection: 'row', gap: 16, borderTopWidth: index === 0 ? 0 : 1 }}>
            <TouchableOpacity onPress={() => selectedAdd(item.id)} style={{ justifyContent: 'center' }}>
              <Image source={checkedList.includes(item.id) ? require("../../assets/images/checked.png") : require("../../assets/images/unchecked.png")} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
            <Image style={{ width: 50, height: 50, borderRadius: 8 }} source={{
              uri: item.image,
            }} />
            <View style={styles.titleContainer}>
              <Text style={{ fontSize: 16}} numberOfLines={1} >{renderTextWithHighlight(item.name, search)}</Text>
              <Text numberOfLines={1}>{`${item.episode.length} Episodes`} </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => !loading && <ThemedText type="default" style={{ borderWidth: 0 , }}>Maalesef arama sonucuna göre bir karakter bulunamadı...</ThemedText>}
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
