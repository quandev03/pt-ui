export interface IConfigItem {
  id: number;
  type: string;
  code: string;
  name: string;
  dataType: string | null;
  value: string;
  status: number;
  statusOnline: number;
  activeChannel: string;
  channels: string;
}
