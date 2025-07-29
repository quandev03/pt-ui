import { useLocation } from 'react-router-dom';
import Image from 'apps/Sign/src/assets/images/hoan_thanh.png';

export const PaySuccess = () => {
  const location = useLocation();
  const orderCode = new URLSearchParams(location.search)?.get('vnp_TxnRef');
  return (
    <div className="title-heading text-center my-auto mt-12">
      <h1 className="mt-6 mb-8 md:text-5xl text-3xl font-bold">
        ĐƠN HÀNG CỦA BẠN HOÀN TẤT
      </h1>
      <div className="flex align-middle justify-center items-center mx-auto">
        <img src={Image} alt="hoanThanh" />
      </div>
      <p className="text-slate-400 max-w-xl mx-auto">
        Cảm ơn bạn đã tin tưởng và lựa chọn VNSKY!
      </p>
      <p className="text-slate-400 max-w-xl mx-auto">
        Mã đơn của bạn là: <span>{orderCode}</span>
      </p>
    </div>
  );
};

export default PaySuccess;
