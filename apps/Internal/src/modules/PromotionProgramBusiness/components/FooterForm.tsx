import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '@react/commons/Button';
import Show from '@react/commons/Template/Show';
import { ActionType } from '@react/constants/app';
import { Space } from 'antd';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useNavigate } from 'react-router-dom';
interface FooterFormProps {
  typeModal: ActionType;
  handleCloseModal: () => void;
  setSubmitType: (type: string) => void;
  loadingAdd: boolean;
  loadingEdit: boolean;
  id: string;
}
export const FooterForm = ({
  typeModal,
  handleCloseModal,
  setSubmitType,
  loadingAdd,
  loadingEdit,
  id,
}: FooterFormProps) => {
  const navigate = useNavigate();
  return (
    <>
      <Show.When isTrue={true}>
        <Space className="mt-4 flex justify-end">
          {typeModal === ActionType.ADD || typeModal === ActionType.EDIT ? (
            <>
              <Show.When isTrue={typeModal === ActionType.ADD}>
                <CButtonSaveAndAdd
                  onClick={() => setSubmitType('saveAndAdd')}
                  htmlType="submit"
                  loading={loadingAdd}
                />
              </Show.When>
              <CButtonSave
                onClick={() => setSubmitType('save')}
                htmlType="submit"
                loading={loadingAdd || loadingEdit}
              />
            </>
          ) : (
            <Show.When isTrue={typeModal === ActionType.VIEW}>
              <CButtonEdit
                disabled={false}
                onClick={() => {
                  navigate(pathRoutes.promotionProgramBusinessEdit(id));
                }}
              />
            </Show.When>
          )}
          <CButtonClose
            onClick={handleCloseModal}
            disabled={false}
            type="default"
          />
        </Space>
      </Show.When>
    </>
  );
};
