export interface IReflectionCategory {
  key?: number;
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
  id: number;
  parentId: number | null;
  typeName: string;
  typeCode: string;
  status: number;
  level: number;
  feedbackSlaConfigs: IFeedbackSlaConfigs[];
  children?: IReflectionCategory[];
  isExpanded: any;
  allowChangeStatus: boolean;
}

export interface IFeedbackSlaConfigs {
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
  id: number;
  priorityLevel: string;
  approvalDeadline?: number;
  processingDeadline?: number;
  closingDeadline?: number;
  completionDeadline?: number;
}

export interface IAddUpdateFeedbackSlaConfigs {
  priorityLevel: string;
  approvalDeadline: number;
  processingDeadline: number;
  closingDeadline: number;
  completionDeadline: number;
}

export interface PayloadAddReflectionCategory {
  parentId: number;
  typeName: string;
  status: number;
  feedbackSlaConfigs?: IAddUpdateFeedbackSlaConfigs[];
}

export interface PayloadUpdateReflectionCategory {
  id: string;
  data: PayloadAddReflectionCategory;
}

export interface TreeNode {
  title: string;
  value: string;
  key: string;
  status?: number;
  parentId?: string | null;
  children?: TreeNode[];
}

export interface IPriorityItem {
  id: number;
  type: string;
  code: string;
  name: string;
  dataType: string | null;
  value: string;
  status: string;
}
