import { Platform, AsyncStorage } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { getPreferences, SQLITE_DB_NAME, SQLITE_DB_VERSION } from './config';

const isWeb = Platform.OS === 'web';
const db = !isWeb && SQLite.openDatabase(SQLITE_DB_NAME);

export function initAndUpdateDatabase() {
  if (!isWeb) {
    //Create DB Tables
    db.transaction(
      tx => {
        // tx.executeSql('drop table diagnostics');
        tx.executeSql(
          'create table if not exists diagnostics (id integer primary key not null, answers text, result text, location text, created_at int);',
        );
        tx.executeSql(
          'create table if not exists locations (id integer primary key not null, location text, created_at int);',
        );
        // Query user_version and compare to actual in case of migration is needed
        // tx.executeSql(
        //   'select * from pragma_user_version',
        //   [],
        //   (_, { rows }) => console.log(rows),
        // );
      },
      (error: SQLError) => console.log('Error in transaction', error.message),
      () => {
        console.log('Create tables success');
      },
    );
    // Set the user_version for future migrations purposes
    db.exec(
      [{ sql: `PRAGMA user_version = ${SQLITE_DB_VERSION};`, args: [] }],
      false,
      (error, rs) => {
        // console.log('user_version', error, rs);
      },
    );
  }
}

export async function saveDiagnosticLocally(
  answers,
  result,
  location,
  onSucceed,
) {
  if (isWeb) {
    const diagnostics = await getLocalDiagnostics();
    const now = new Date().getTime();
    const item = JSON.stringify([
      ...diagnostics,
      {
        answers: answers,
        result,
        location,
        created_at: now,
      },
    ]);
    await AsyncStorage.setItem(`diagnostics`, item);
    onSucceed();
    return item;
  } else {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO diagnostics (answers, result, location, created_at) values (?, ?, ?, strftime("%s","now"))',
          [JSON.stringify(answers), result, JSON.stringify(location)],
          (tx, result) => {
            console.log('Diagnostic saved!');
            onSucceed();
            resolve(true);
          },
          (tx, error) => {
            console.log('Error inserting values', error.message);
            reject(error);
            return false;
          },
        );
      });
    });
  }
}

export async function saveLocationLocally(location) {

  // No almacenar Location si la opción de rastreo GPS está desactivada
  try {
    const preferences = await getPreferences();
    const userInfo = preferences.userInfo;
    if(!userInfo || !userInfo.gps) {
      return false;
    }
  } catch (error) {
    console.log(error);
  }

  if (isWeb) {
    let locations = JSON.parse(await AsyncStorage.getItem('locations')) || [];
    if (!locations.length) locations = [];

    locations.push(location);
    const item = JSON.stringify(locations);

    await AsyncStorage.setItem(`locations`, item);
  } else {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO locations (location, created_at) values (?, strftime("%s","now"))',
          [JSON.stringify(location)],
          (tx, result) => {
            // console.log('Location saved!');
            resolve(true);
          },
          (tx, error) => {
            console.log('Error inserting values', error.message);
            reject(error);
            return false;
          },
        );
      });
    });
  }
}

export async function getLocalLocations(location) {
  if (isWeb) {
    const locations = JSON.parse(await AsyncStorage.getItem('locations')) || [];
    return locations;
  } else {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM locations',
          [],
          (tx, result) => {
            let locations = [];
            const rows = <any>result.rows;
            if (result && rows && rows._array) {
              locations = rows._array;
            }
            resolve(locations);
          },
          (tx, error) => {
            console.log('Could not execute query', error.message);
            reject(error);
            return false;
          },
        );
      });
    });
  }
}

export async function getLocalDiagnostics() {
  if (isWeb) {
    const diagnostics =
      JSON.parse(await AsyncStorage.getItem('diagnostics')) || [];
    return diagnostics;
  } else {
    return new Promise((resolve, reject) => {
      db.readTransaction(tx => {
        tx.executeSql(
          'SELECT * FROM diagnostics',
          [],
          (tx, result) => {
            let diagnostics = [];
            const rows = <any>result.rows;
            if (result && rows && rows._array) {
              diagnostics = rows._array;
            }
            resolve(diagnostics);
          },
          (tx, error) => {
            console.log('Could not execute query', error.message);
            reject(error);
            return false;
          },
        );
      });
    });
  }
}

export async function deleteLocalDiagnostics() {
  if (isWeb) {
    try {
      await AsyncStorage.removeItem('diagnostics');
      return true;
    } catch (exception) {
      return false;
    }
  } else {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM diagnostics',
          [],
          (tx, result) => {
            console.log('Deleted diagnostics', result.rowsAffected);
            resolve(true);
          },
          (tx, error) => {
            console.log('Could not execute query', error.message);
            reject(error);
            return false;
          },
        );
      });
    });
  }
}
