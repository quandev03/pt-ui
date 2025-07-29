export interface ILoginDataRequest {
  password: string;
  username: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
}
export interface IClientType {
  id: string;
  code: string;
  name: string;
}
export enum AdditionalActionType {
  REQUIRE_CLIENT_SELECTION = "REQUIRE_CLIENT_SELECTION",
  REQUIRE_PASSWORD_CHANGE = "REQUIRE_PASSWORD_CHANGE",
}
export interface ICheckServiceRegistered {
  parentServiceName: string;
  childServiceName: string;
  remainingDays: number;
  activeController?: number;
  isFree?: number;
  display: number;
  type: number;
}
