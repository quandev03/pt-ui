import {
  CButton,
  CCheckbox,
  CInput,
  NotificationSuccess,
} from '@vissoft-react/common';
import { Form } from 'antd';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { useUpdateSubscriberInfoStore } from '../store';
import { StepEnum } from '../type';
import Decree13Modal from './Decree13Modal';
import PreviewPdf from './PreviewPdf';

const SignConfirmation = () => {
  const { setStep } = useUpdateSubscriberInfoStore();
  const handleUpdate = () => {
    setStep(StepEnum.STEP6);
  };
  const [isOpenDecree13, setIsOpenDecree13] = useState(false);
  const handleOpenDecree13 = () => {
    setIsOpenDecree13(true);
  };
  return (
    <>
      <div className="flex items-center flex-col justify-between min-h-[72vh] gap-5">
        <div className="flex items-center flex-col w-full">
          <p className="text-lg font-semibold mt-2 mb-3">
            Ký biên bản xác nhận
          </p>
          <div className="w-full">
            <p className="text-[15px] mb-2 font-medium">Link ký online</p>
            <div className="flex justify-between gap-4 items-center">
              {/* <div className="flex justify-between items-center px-4 py-2 bg-[#D8D8D8] rounded-lg h-10 overflow-hidden flex-1">
              <p className="text-[#1C9BE4]">https://sign.bcss-vnsky-test</p>
              <Copy size={22} className="cursor-pointer" />
            </div> */}
              <Form.Item
                name="signLink"
                initialValue={'https://sign.bcss-vnsky-test'}
                className="flex-1 mb-0"
              >
                <CInput
                  disabled={true}
                  placeholder="Link ký"
                  suffix={
                    // signLink ? (
                    <Copy
                      size={22}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          'https://sign.bcss-vnsky-test'
                        );
                        NotificationSuccess('Copy thành công');
                      }}
                      className="cursor-pointer"
                      color="#444444"
                    />
                    // ) : undefined
                  }
                />
              </Form.Item>
              <CButton>Tạo link ký</CButton>
            </div>
            <div className="flex gap-3 mt-3">
              <div>
                <p className="mb-1">Biên bản xác nhận</p>
                <PreviewPdf
                  fileUrl="https://drive.google.com/file/d/1sgf6tNfuoOFomEXvmTxsstYN3kOq6so_/view?usp=sharing"
                  title="Biên bản xác nhận"
                />
              </div>
              <div>
                <p className="mb-1">BBXN NĐ13</p>
                <PreviewPdf
                  fileUrl="https://drive.google.com/file/d/1sgf6tNfuoOFomEXvmTxsstYN3kOq6so_/view?usp=sharing"
                  title="BBXN NĐ13"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <CCheckbox />
              <p>
                Tôi đã đọc và đồng ý với{' '}
                <span
                  className="text-[#005AA9] font-semibold cursor-pointer"
                  onClick={handleOpenDecree13}
                >
                  văn bản chấp nhận về việc xử lý và bảo vệ dữ liệu cá nhân.
                </span>
              </p>
            </div>
          </div>
        </div>
        <CButton
          className="rounded-full py-6 w-full mt-3"
          onClick={handleUpdate}
        >
          Cập nhật TTTB
        </CButton>
      </div>
      <Decree13Modal
        open={isOpenDecree13}
        onClose={() => setIsOpenDecree13(false)}
      />
    </>
  );
};
export default SignConfirmation;
