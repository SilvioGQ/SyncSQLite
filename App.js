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

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("test-database.sqlite");
  return db;
}

const db = openDatabase();

function Items({onPressItem}) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from users2",[],
        (_, { rows: { _array } }) => setItems(_array)
        );
      });
    }, []);
    console.log(items)

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

export default function App() {
  const [text, setText] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [senha, setSenha] = useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists users2 (id integer primary key not null, name text, email text, password text);"
      );
    });
  }, []);
  const add = (name,email,senha) => {
    // is text empty?

    db.transaction(
      (tx) => {
        tx.executeSql("insert into users2 (name,email,password) values (?,?,?)", [name,email,senha]);
        tx.executeSql("select * from users2", [], (_, { rows }) =>
          console.log('rows',JSON.stringify(rows))
        );
      },
      null,
      forceUpdate
    );
  };

  return (
    <View style={styles.container}>

      {/* {Platform.OS === "web" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.heading}>
            Expo SQlite is not supported on web!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.flexRow}>
            <TextInput
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => {
                add(text);
                setText(null);
              }}
              placeholder="what do you need to do?"
              style={styles.input}
              value={text}
            />
          </View>
          <ScrollView style={styles.listArea}>
            <Items
              key={`forceupdate-todo-${forceUpdateId}`}
              onPressItem={(id) =>
                db.transaction(
                  (tx) => {
                    tx.executeSql(`update users2 set name = 'opa' where id = ?;`, [
                      id,
                    ]);
                  },
                  null,
                  forceUpdate
                )
              }
            />
            <Items
              key={`forceupdate-done-${forceUpdateId}`}
              onPressItem={(id) =>
                db.transaction(
                  (tx) => {
                    tx.executeSql(`delete from users2 where id = ?;`, [id]);
                  },
                  null,
                  forceUpdate
                )
              }
            />
          </ScrollView>
        </>
      )} */}
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
        <TouchableOpacity onPress={()=>{add(name,email,senha);}}><Text>Salvar</Text></TouchableOpacity>
        <ScrollView style={styles.listArea}>
            <Items
              key={`forceupdate-todo-${forceUpdateId}`}
              onPressItem={(id) =>
                db.transaction(
                  (tx) => {
                    tx.executeSql(`update users2 set name = 'opa' where id = ?;`, [
                      id,
                    ]);
                  },
                  null,
                  forceUpdate
                )
              }
            />
          </ScrollView>
    </View>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
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