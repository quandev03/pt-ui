export interface ILoginDataRequest {
  client_identity: string;
  password: string;
  username: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface IInitPayload {
  clientIdentity: string;
  email: string;
  callbackUri: string;
}
export interface INewPass {
  count: number;
  message: string;
  constraint: boolean;
  value: string;
}
