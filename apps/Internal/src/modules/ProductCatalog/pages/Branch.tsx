import { ActionType } from '@react/constants/app';
import AddEditViewPage from './AddEditView';
import AddEditViewPGPage from './AddEditViewProductGroup';

export const ProductCatalogAddPage: React.FC = () => {
  return <AddEditViewPage actionType={ActionType.ADD} />;
};

export const ProductCatalogEditPage: React.FC = () => {
  return <AddEditViewPage actionType={ActionType.EDIT} />;
};

export const ProductCatalogViewPage: React.FC = () => {
  return <AddEditViewPage actionType={ActionType.VIEW} />;
};

export const ProductGroupAddPage: React.FC = () => {
  return <AddEditViewPGPage actionType={ActionType.ADD} />;
};

export const ProductGroupEditPage: React.FC = () => {
  return <AddEditViewPGPage actionType={ActionType.EDIT} />;
};

export const ProductGroupViewPage: React.FC = () => {
  return <AddEditViewPGPage actionType={ActionType.VIEW} />;
};
