import * as FileSystem from 'expo-file-system'
import RNFetchBlob from 'rn-fetch-blob';
import * as axios from 'axios'
const BASE_API = 'http://localhost:3001';
const DEFAULT_DATABASE_PATH=`${FileSystem.documentDirectory}/SQLite/`
export async function Pull() {
    console.log("faz o pull mermão")
    let dirs = RNFetchBlob.fs.dirs
    const res=await RNFetchBlob.config({
      // response data will be saved to this path if it has access right.
      path : dirs.DocumentDir +'/SQLite/db.sqlite'
    })
    .fetch('GET', `${BASE_API}/sync`, {
      //some headers ..
    })
    console.log(res.path())
    return "db.sqlite"
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
