import { CButton, CModal } from '@vissoft-react/common';
import { Checkbox, Form } from 'antd';
import { X } from 'lucide-react';
import { FC, useState } from 'react';
import { terms } from '../constants';
type Props = {
  open: boolean;
  onClose: () => void;
};
const Decree13Modal: FC<Props> = ({ open, onClose }) => {
  const [isViewDetail, setIsViewDetail] = useState(false);
  const handleViewDetail = () => {
    setIsViewDetail(true);
  };
  const handleCancel = () => {
    setIsViewDetail(false);
    onClose();
  };
  return (
    <CModal
      title="Nghị định 13"
      open={open}
      onCancel={handleCancel}
      closeIcon={<X color="#ffffff" />}
      footer={
        <div className="flex flex-col gap-2 w-full px-4">
          {!isViewDetail && (
            <CButton
              type="default"
              className="w-full rounded-full py-6"
              onClick={handleViewDetail}
            >
              Xem chi tiết
            </CButton>
          )}
          <CButton className="w-full rounded-full py-6" onClick={handleCancel}>
            Xác nhận
          </CButton>
        </div>
      }
      destroyOnHidden
    >
      <div className="border border-[#EEF3FE] px-5 h-[60vh] overflow-auto">
        <Form.Item name="terms">
          <Checkbox.Group>
            {terms.map((term) => (
              <Checkbox
                key={term.id}
                value={term.id}
                disabled={term.id < 4}
                className="gap-3 py-3 items-start flex border-b border-b-[#EEF3FE]"
              >
                <div className="text-black">
                  <p className="font-semibold">Điều {term.id}</p>
                  <p>{term.label}</p>
                </div>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        {isViewDetail && (
          <div>
            <p className="text-[#245CE9] mb-4 font-semibold text-center px-4 pt-6">
              CHÍNH SÁCH BẢO VỆ THÔNG TIN KHÁCH HÀNG CỦA TỔNG CÔNG TY VIỄN THÔNG
              MOBIFONE
            </p>
            <p className="whitespace-pre-line">
              {`Căn cứ:\n • Luật bảo vệ quyền lợi người tiêu dùng số
            19/2023/QH15 do Quốc hội ban hành ngày 20/06/2023;\n• Luật Viễn thông số 24/2023/QH15 do Quốc hội ban hành
            ngày 24/11/2023 và các văn bản hướng dẫn thi hành;\n• Nghị định 163/2024/NĐ-CP do Chính phủ ban hành ngày 24/12/2024 quy
            định chi tiết một số điều và biện pháp thi hành Luật viễn thông;\n• Nghị định 55/2024/NĐ-CP do Chính phủ ban hành
            ngày 16/05/2024 quy định chi tiết một số điều của Luật bảo vệ quyền
            lợi người tiêu dùng;\n• Nghị định 13/2023/NĐ-CP do Chính phủ ban
            hành ngày 17/04/2023 về bảo vệ dữ liệu cá nhân;\n• Nghị định 06/2016/NĐ-CP do Chính phủ ban hành
            ngày 18/01/2016 quy định quản lý, cung cấp và sử dụng dịch vụ phát
            thanh, truyền hình sửa đổi bổ sung bởi Nghị định 71/2022/NĐ-CP;\n• Quyết
            định số 07/2024/QĐ-TTg do Thủ tướng Chính phủ ban hành ngày
            20/06/2024 ban hành Danh mục sản phẩm, hàng hóa, dịch vụ phải đăng
            ký hợp đồng theo mẫu, điều kiện giao dịch chung.`}
            </p>
          </div>
        )}
      </div>
    </CModal>
  );
};
export default Decree13Modal;
