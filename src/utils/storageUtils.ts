import AsyncStorage from '@react-native-async-storage/async-storage';
import log from './log';

export const AppLanguageStorageKey: string = 'app-languague';

export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    log.e('Failed to save the data to the storage');
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    log.e('Failed to fetch the data from storage');
  }
};
