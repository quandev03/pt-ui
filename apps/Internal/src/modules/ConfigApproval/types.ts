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

export interface ConfigApprovalType {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  processCode: string;
  processName: string;
  objectName: string;
  description: string;
  orgId: number;
  processSteps: ProcessStepType[];
}
