import checkCircle from '../../../assets/images/checkCircle.png';
import successImage from '../../../assets/images/successImage.png';
const SuccessUpdation = () => {
  return (
    <div className="flex items-center flex-col min-h-[72vh] gap-5 justify-center">
      <div className="w-1/5">
        <img src={checkCircle} alt="tick icon" />
      </div>
      <p className="text-[#1A3263] text-lg font-semibold text-center">
        Cập nhật thông tin thuê bao thành công
      </p>
      <div>
        <img src={successImage} alt="success" />
      </div>
    </div>
  );
};
export default SuccessUpdation;
