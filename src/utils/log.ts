import {Platform} from 'react-native';

class Log {
  static TAG = 'MURF_LOG - ' + Platform.OS;
  log = (type: string, what?: string, message?: any) => {
    if (__DEV__) {
      what = what ?? 'GENERAL';
      switch (type) {
        case 'DEBUG':
          console.log(
            '\x1b[33m' + Log.TAG + ' - ' + type + ' ::: ' + what + ' ::: ',
            JSON.stringify(message),
          );
          break;
        case 'ERROR':
          console.log(
            '\x1b[31m' + Log.TAG + ' - ' + type + ' ::: ' + what + ' ::: ',
            JSON.stringify(message),
          );
          break;
        default:
          console.log(
            '\x1b[36m' + Log.TAG + ' - ' + type + ' ::: ' + what + ' ::: ',
            JSON.stringify(message),
          );
          break;
      }
      console.log(
        '--------------------------------------------------------------------------------------------------------------',
      );
    }
  };
  i = (message: any, what?: string) => {
    this.log('INFO', what, message);
  };

  d = (message: any, what?: string) => {
    this.log('DEBUG', what, message);
  };

  e = (message: any, what?: string) => {
    this.log('ERROR', what, message);
  };
}

/*
  COLOR CODES

  Black: \u001b[30m
  Red: \u001b[31m
  Green: \u001b[32m
  Yellow: \u001b[33m
  Blue: \u001b[34m
  Magenta: \u001b[35m
  Cyan: \u001b[36m
  White: \u001b[37m
  Reset: \u001b[0m
*/

export default new Log();
