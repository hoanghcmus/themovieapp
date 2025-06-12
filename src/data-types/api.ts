import {AxiosResponse} from 'axios';

export interface BaseResponse<D> extends AxiosResponse {
  data: D;
}

export interface IToken {
  token: string;
}
