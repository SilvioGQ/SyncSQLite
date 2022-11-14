import * as FileSystem from 'expo-file-system'
import RNFetchBlob from 'rn-fetch-blob';
import * as axios from 'axios'
const BASE_API = 'http://localhost:3001';
const DEFAULT_DATABASE_PATH=`${FileSystem.documentDirectory}/SQLite/`
export async function Pull() {
    try{
        // if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'db.sqlite')).exists) {
        //     await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'db.sqlite');
        //  }
        //await FileSystem.downloadAsync(`${BASE_API}/sync`,DEFAULT_DATABASE_PATH + 'db.sqlite')
        return 'db.sqlite'
    }
    catch(err){
        console.log(err)
    }
}
export async function Push() {
    try{
        console.log("faz o push ai mermao")
        const res=await RNFetchBlob.fetch('POST', `${BASE_API}/sync`, {'Content-Type' : 'application/x-sqlite3',}, RNFetchBlob.wrap(DEFAULT_DATABASE_PATH + 'db.sqlite'))
        console.log(res.json())
    }
    catch(err){
        console.log(err)
    }

}
