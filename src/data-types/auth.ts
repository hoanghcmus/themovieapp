export interface HeaderProps {
  'Content-Type': string;
  Accept: string;
  'Accept-Language'?: string;
  'x-access-token'?: string;
  'x-client-version': string;
  'x-client-variants'?: string;
}

export enum CommonError {
  BLOCKED_USER_ERROR = 'BLOCKED_USER_ERROR',
  FORBIDDEN = 'FORBIDDEN',
  REQUEST_TIMEOUT = '[API_ERROR] REQUEST_TIMEOUT',
  NETWORK_FAILED = '[API_ERROR] NETWORK_FAILED',
}

export interface ApiRequest {
  method?: string;
  route: string;
  query?: string;
  data?: any;
  skipToken?: boolean;
  timeout?: number;
  customURL?: string | undefined;
  version?: string;
  loading?: boolean;
}
