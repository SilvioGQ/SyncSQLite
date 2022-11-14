import { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import { Pull,Push } from './pages/api'


export default function App() {
  const [text, setText] = useState(null);
  const [items, setItems] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [senha, setSenha] = useState(null);
  const [db,setDb] =useState(null)
  //console.log(items)
  async function getDatabase() {
    const uri_Database=await Pull()
    if(uri_Database){
      const db = SQLite.openDatabase(uri_Database);
      setDb(db)
      return db;
    }
  }
  function Items({onPressItem}) {
    return (
      <View style={styles.sectionContainer}>
        {items && items.map(({ id, name }) => (
          <TouchableOpacity
            key={id}
            onPress={() => onPressItem && onPressItem(id)}
            style={{
              borderColor: "#000",
              borderWidth: 1,
              padding: 8,
            }}
          >
            <Text>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  useEffect(() => {
     getDatabase()
  }, []);


  useEffect(() => {
    if(!db) return;
    db.transaction((tx) => {
    tx.executeSql(
      "select * from users",[],
      (_, { rows: { _array } }) => setItems(_array)
      );
    });
  }, [db,items]);
  const add = (name,email,senha) => {
    if(!db) return
    db.transaction(
      (tx) => {
        tx.executeSql("insert into users (name,email,password,createdAt,updatedAt) values (?,?,?,?,?)", [name,email,senha,new Date().toISOString(),new Date().toISOString()]);
        tx.executeSql(
          "select * from users", [], 
          (_, { rows: { _array } }) => setItems(_array)
        )
      },
      null
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(text) => setName(text)}
        placeholder="name"
        style={styles.input}
        value={name}
/>  
        <TextInput
        onChangeText={(text) => setEmail(text)}
        placeholder="email"
        style={styles.input}
        value={email}
        /> 
        <TextInput
        onChangeText={(text) => setSenha(text)}
        onSubmitEditing={() => {
          add(name,email,senha);
          setText(null);
        }}
        placeholder="senha"
        style={styles.input}
        value={senha}
        /> 
        <TouchableOpacity onPress={()=>{add(name,email,senha);}}><Text>Adicionar</Text></TouchableOpacity>
        <ScrollView style={styles.listArea}>
            <Items
            key={Math.random()*3}
              onPressItem={(id) =>{
                  //if(!db) return;
                  db.transaction(
                    (tx) => {
                      tx.executeSql(`update users set name = 'vsf' where id = ?`, [
                        id,
                      ]);
                      tx.executeSql("select * from users", [], 
                      (_, { rows: { _array } }) => setItems(_array))
                    },
                    null
                  )
                }
              }
            />
          </ScrollView>
          <TextInput
        onChangeText={(text) => setName(text)}
        placeholder="mudar nome"
        style={styles.input}
        value={name}/>  
        <TouchableOpacity onPress={()=>{
          db.transaction(
            (tx) => {
              tx.executeSql(`update users set name = ? where id = ?`, [name,1,
              ]);
              tx.executeSql("select * from users", [], 
              (_, { rows: { _array } }) => setItems(_array))
            },
            null
          )
        }}>
          <Text>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async ()=>{await Push()}}>
          <Text>Push</Text>
        </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
});