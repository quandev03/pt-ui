import { ACTION_MODE_ENUM } from '@react/commons/types';

export interface AddEditViewProps {
  actionMode: ACTION_MODE_ENUM;
}

export interface ProcessStepType {
  createdBy: string;
  createdDate: string;
  id: number;
  modifiedBy: string;
  modifiedDate: string;
  processId: string;
  status: boolean;
  stepOrder: number;
  userId: string;
  userName: string;
}

export interface ObjectType {
  children?: ObjectType[];
  key: string;
  title: string;
  isChildren: string;
  uri: string;
  parentId: string;
}
