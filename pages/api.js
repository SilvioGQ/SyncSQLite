import * as FileSystem from 'expo-file-system'
const BASE_API = 'http://localhost:3001';
const DEFAULT_DATABASE_PATH=`${FileSystem.documentDirectory}/SQLite/`
export async function Pull() {
    try{
        // if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'db.sqlite')).exists) {
        //     await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'db.sqlite');
        //  }
        await FileSystem.downloadAsync(`${BASE_API}/sync`,DEFAULT_DATABASE_PATH + 'db.sqlite')
        return 'db.sqlite'
    }
    catch(err){
        console.log(err)
    }
}
