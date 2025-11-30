import { useState, useCallback, useEffect } from 'react';
import { Form, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useNavigate } from 'react-router-dom';
import {
  NotificationError,
  NotificationSuccess,
  setFieldError,
  UploadFileMax,
} from '@vissoft-react/common';
import {
  useOCRData,
  useGenContract,
  useSaveContract,
} from '../../hooks';
import { IOCRResponse, ISaveContractParams, IGenContractParams, IContractData } from '../../types';
import dayjs from 'dayjs';

export enum StepEnum {
  STEP1 = 0, // Upload ảnh
  STEP2 = 1, // OCR & Hiển thị thông tin
  STEP3 = 2, // Chọn phòng
  STEP4 = 3, // Gen hợp đồng
}

export const useLogicAddContract = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepEnum>(StepEnum.STEP1);
  const [ocrData, setOcrData] = useState<IOCRResponse | null>(null);
  const [contractBlob, setContractBlob] = useState<Blob | null>(null);
  const [contractFileUrl, setContractFileUrl] = useState<string | null>(null);
  const [contractFileType, setContractFileType] = useState<string>('');
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [portraitImage, setPortraitImage] = useState<File | null>(null);

  const { mutate: ocrMutation, isPending: loadingOCR } = useOCRData(
    (data: IOCRResponse) => {
      setOcrData(data);
      // Auto fill form với dữ liệu OCR
      const ocrFront = data?.data_ocr?.ocr_front;
      if (ocrFront) {
        form.setFieldsValue({
          name: ocrFront.name || '',
          address: ocrFront.address || '',
          phone: '', // OCR không có phone
          idCard: ocrFront.id || '',
          issueDate: ocrFront.issue_date || '',
          issueBy: ocrFront.issue_by || '',
        });
        setCurrentStep(StepEnum.STEP2);
      } else {
        NotificationError({
          message: 'Không thể đọc thông tin từ OCR',
        });
      }
    },
    (error) => {
      console.error('OCR Error:', error);
    }
  );

  const { mutate: genContractMutation, isPending: loadingGenContract } =
    useGenContract(
      (data: Blob) => {
        try {
          // Đảm bảo data là Blob
          let blob: Blob;
          if (data instanceof Blob) {
            blob = data;
          } else if (data instanceof ArrayBuffer) {
            // Nếu không có type, mặc định là PDF
            blob = new Blob([data], { type: 'application/pdf' });
          } else {
            // Nếu không phải Blob, thử convert
            blob = new Blob([data as any], { type: 'application/pdf' });
          }
          
          // Xác định type từ blob, nếu không có thì mặc định là PDF
          let fileType = blob.type || 'application/pdf';
          
          // Nếu type rỗng hoặc không xác định, kiểm tra dựa trên content
          if (!fileType || fileType === 'application/octet-stream') {
            // Có thể là PDF hoặc DOCX, mặc định là PDF
            fileType = 'application/pdf';
          }
          
          // Đảm bảo blob có type đúng
          if (!blob.type || blob.type === 'application/octet-stream') {
            blob = new Blob([blob], { type: fileType });
          }
          
          setContractFileType(fileType);
          setContractBlob(blob);
          const url = URL.createObjectURL(blob);
          setContractFileUrl(url);
          NotificationSuccess('Tạo hợp đồng thành công');
        } catch (error) {
          console.error('Error processing contract blob:', error);
          NotificationError({ message: 'Lỗi khi xử lý file hợp đồng' });
        }
      },
      (error) => {
        console.error('Gen Contract Error:', error);
      }
    );

  const { mutate: saveContractMutation, isPending: loadingSave } =
    useSaveContract(
      () => {
        navigate(-1);
      },
      (errors) => {
        setFieldError(form, errors);
      }
    );

  const handleNext = useCallback(() => {
    if (currentStep === StepEnum.STEP1) {
      // Validate 3 ảnh đã upload
      const front = form.getFieldValue('front');
      const back = form.getFieldValue('back');
      const portrait = form.getFieldValue('portrait');

      if (!front || !front.length || !front[0]?.originFileObj) {
        NotificationError({ message: 'Vui lòng upload ảnh mặt trước CCCD' });
        return;
      }
      if (!back || !back.length || !back[0]?.originFileObj) {
        NotificationError({ message: 'Vui lòng upload ảnh mặt sau CCCD' });
        return;
      }
      if (!portrait || !portrait.length || !portrait[0]?.originFileObj) {
        NotificationError({ message: 'Vui lòng upload ảnh chân dung' });
        return;
      }

      // Lưu các file ảnh để dùng khi save contract
      setFrontImage(front[0].originFileObj);
      setBackImage(back[0].originFileObj);
      setPortraitImage(portrait[0].originFileObj);
      
      // Call OCR API
      ocrMutation({
        front: front[0].originFileObj,
        back: back[0].originFileObj,
        portrait: portrait[0].originFileObj,
        typeCard: 1,
      });
    } else if (currentStep === StepEnum.STEP2) {
      // Validate form và chuyển sang bước chọn phòng
      form.validateFields(['name', 'address', 'idCard', 'issueDate', 'issueBy'])
        .then(() => {
          setCurrentStep(StepEnum.STEP3);
        })
        .catch(() => {
          NotificationError({ message: 'Vui lòng kiểm tra lại thông tin' });
        });
    } else if (currentStep === StepEnum.STEP3) {
      // Validate phòng đã chọn và chuyển sang bước gen contract
      form.validateFields(['roomId'])
        .then(() => {
          if (!ocrData || !frontImage || !backImage || !portraitImage) {
            NotificationError({ message: 'Thiếu thông tin để tạo hợp đồng' });
            return;
          }
          
          setCurrentStep(StepEnum.STEP4);
          // Tự động gọi API gen contract khi vào bước 4
          const roomId = form.getFieldValue('roomId');
          const values = form.getFieldsValue();
          const ocrFront = ocrData.data_ocr.ocr_front;
          
          // Parse dates từ OCR
          const parseDate = (dateStr: string) => {
            if (!dateStr) return { day: '', month: '', year: '' };
            const parts = dateStr.split('-');
            if (parts.length >= 3) {
              return {
                day: parts[0] || '',
                month: parts[1] || '',
                year: parts[2] || '',
              };
            }
            return { day: '', month: '', year: '' };
          };

          const tenantIdIssue = parseDate(ocrFront.issue_date || '');
          const startDate = values.startDate ? dayjs(values.startDate) : dayjs();
          const endDate = values.endDate ? dayjs(values.endDate) : dayjs().add(1, 'year');
          const currentDate = dayjs();

          // Tạo contractData
          const contractData: IContractData = {
            contractLocation: values.address || ocrFront.address || 'Hà Nội',
            currentDay: currentDate.format('DD'),
            currentMonth: currentDate.format('MM'),
            currentYear: currentDate.format('YYYY'),
            ownerName: '',
            ownerBirth: '',
            ownerPermanentAddress: '',
            ownerId: '',
            ownerIdIssueDay: '',
            ownerIdIssueMonth: '',
            ownerIdIssueYear: '',
            ownerIdIssuePlace: '',
            ownerPhone: '',
            tenantName: values.name || ocrFront.name || '',
            tenantBirth: ocrFront.birthday || '',
            tenantPermanentAddress: values.address || ocrFront.address || '',
            tenantId: values.idCard || ocrFront.id || '',
            tenantIdIssueDay: tenantIdIssue.day,
            tenantIdIssueMonth: tenantIdIssue.month,
            tenantIdIssueYear: tenantIdIssue.year,
            tenantIdIssuePlace: values.issueBy || ocrFront.issue_by || '',
            tenantPhone: values.phone || '',
            roomAddress: '',
            rentPrice: '',
            paymentMethod: 'Trả tiền mặt hàng tháng',
            electricPrice: '',
            waterPrice: '',
            depositAmount: '',
            startDateDay: startDate.format('DD'),
            startDateMonth: startDate.format('MM'),
            startYear: startDate.format('YYYY'),
            endDateDay: endDate.format('DD'),
            endDateMonth: endDate.format('MM'),
            endYear: endDate.format('YYYY'),
            noticeDays: '30',
          };

          const genParams: IGenContractParams = {
            organizationUnitId: roomId,
            contractData,
            frontImage,
            backImage,
            portraitImage,
          };

          genContractMutation(genParams);
        })
        .catch(() => {
          NotificationError({ message: 'Vui lòng chọn phòng' });
        });
    }
  }, [currentStep, form, ocrMutation, genContractMutation, ocrData, frontImage, backImage, portraitImage]);

  const handleRegenContract = useCallback(() => {
    // Cho phép gen lại contract nếu cần
    if (!ocrData || !frontImage || !backImage || !portraitImage) {
      NotificationError({ message: 'Thiếu thông tin để tạo hợp đồng' });
      return;
    }

    const roomId = form.getFieldValue('roomId');
    const values = form.getFieldsValue();
    const ocrFront = ocrData.data_ocr.ocr_front;
    
    // Parse dates từ OCR
    const parseDate = (dateStr: string) => {
      if (!dateStr) return { day: '', month: '', year: '' };
      const parts = dateStr.split('-');
      if (parts.length >= 3) {
        return {
          day: parts[0] || '',
          month: parts[1] || '',
          year: parts[2] || '',
        };
      }
      return { day: '', month: '', year: '' };
    };

    const tenantIdIssue = parseDate(ocrFront.issue_date || '');
    const startDate = values.startDate ? dayjs(values.startDate) : dayjs();
    const endDate = values.endDate ? dayjs(values.endDate) : dayjs().add(1, 'year');
    const currentDate = dayjs();

    // Tạo contractData
    const contractData: IContractData = {
      contractLocation: values.address || ocrFront.address || 'Hà Nội',
      currentDay: currentDate.format('DD'),
      currentMonth: currentDate.format('MM'),
      currentYear: currentDate.format('YYYY'),
      ownerName: '',
      ownerBirth: '',
      ownerPermanentAddress: '',
      ownerId: '',
      ownerIdIssueDay: '',
      ownerIdIssueMonth: '',
      ownerIdIssueYear: '',
      ownerIdIssuePlace: '',
      ownerPhone: '',
      tenantName: values.name || ocrFront.name || '',
      tenantBirth: ocrFront.birthday || '',
      tenantPermanentAddress: values.address || ocrFront.address || '',
      tenantId: values.idCard || ocrFront.id || '',
      tenantIdIssueDay: tenantIdIssue.day,
      tenantIdIssueMonth: tenantIdIssue.month,
      tenantIdIssueYear: tenantIdIssue.year,
      tenantIdIssuePlace: values.issueBy || ocrFront.issue_by || '',
      tenantPhone: values.phone || '',
      roomAddress: '',
      rentPrice: '',
      paymentMethod: 'Trả tiền mặt hàng tháng',
      electricPrice: '',
      waterPrice: '',
      depositAmount: '',
      startDateDay: startDate.format('DD'),
      startDateMonth: startDate.format('MM'),
      startYear: startDate.format('YYYY'),
      endDateDay: endDate.format('DD'),
      endDateMonth: endDate.format('MM'),
      endYear: endDate.format('YYYY'),
      noticeDays: '30',
    };

    const genParams: IGenContractParams = {
      organizationUnitId: roomId,
      contractData,
      frontImage,
      backImage,
      portraitImage,
    };

    genContractMutation(genParams);
  }, [form, genContractMutation, ocrData, frontImage, backImage, portraitImage]);

  const handleSaveContract = useCallback(() => {
    // Validate roomId trước
    form.validateFields(['roomId'])
      .then(() => {
        // Lấy roomId trực tiếp từ form
        const roomId = form.getFieldValue('roomId');
        
        if (!roomId || (typeof roomId === 'string' && roomId.trim() === '')) {
          NotificationError({ message: 'Vui lòng chọn phòng' });
          return;
        }

        // Validate các field khác
        return form.validateFields();
      })
      .then((values) => {
        if (!ocrData) {
          NotificationError({ message: 'Không có dữ liệu OCR' });
          return;
        }

        // Lấy roomId trực tiếp từ form (đảm bảo có giá trị)
        const roomId = form.getFieldValue('roomId');
        
        if (!roomId || (typeof roomId === 'string' && roomId.trim() === '')) {
          NotificationError({ message: 'Vui lòng chọn phòng' });
          return;
        }

        // Kiểm tra và lấy lại file ảnh từ form nếu state bị mất
        let finalFrontImage = frontImage;
        let finalBackImage = backImage;
        let finalPortraitImage = portraitImage;

        // Log trạng thái file hiện tại
        console.log('File state check:', {
          frontImage: {
            exists: !!frontImage,
            isFile: frontImage instanceof File,
            name: frontImage?.name,
            size: frontImage?.size,
          },
          backImage: {
            exists: !!backImage,
            isFile: backImage instanceof File,
            name: backImage?.name,
            size: backImage?.size,
          },
          portraitImage: {
            exists: !!portraitImage,
            isFile: portraitImage instanceof File,
            name: portraitImage?.name,
            size: portraitImage?.size,
          },
        });

        // Nếu state bị null, thử lấy lại từ form
        if (!finalFrontImage || !finalBackImage || !finalPortraitImage) {
          console.log('Files missing from state, trying to retrieve from form...');
          const front = form.getFieldValue('front');
          const back = form.getFieldValue('back');
          const portrait = form.getFieldValue('portrait');
          
          if (front && front.length > 0 && front[0]?.originFileObj) {
            finalFrontImage = front[0].originFileObj;
            setFrontImage(finalFrontImage);
            console.log('Retrieved frontImage from form:', finalFrontImage.name);
          }
          if (back && back.length > 0 && back[0]?.originFileObj) {
            finalBackImage = back[0].originFileObj;
            setBackImage(finalBackImage);
            console.log('Retrieved backImage from form:', finalBackImage.name);
          }
          if (portrait && portrait.length > 0 && portrait[0]?.originFileObj) {
            finalPortraitImage = portrait[0].originFileObj;
            setPortraitImage(finalPortraitImage);
            console.log('Retrieved portraitImage from form:', finalPortraitImage.name);
          }
        }

        // Validate files are File objects
        if (!finalFrontImage || !(finalFrontImage instanceof File)) {
          console.error('frontImage is missing or not a File object:', finalFrontImage);
          NotificationError({ message: 'Thiếu ảnh mặt trước CCCD. Vui lòng quay lại bước 1 để upload lại.' });
          return;
        }
        if (!finalBackImage || !(finalBackImage instanceof File)) {
          console.error('backImage is missing or not a File object:', finalBackImage);
          NotificationError({ message: 'Thiếu ảnh mặt sau CCCD. Vui lòng quay lại bước 1 để upload lại.' });
          return;
        }
        if (!finalPortraitImage || !(finalPortraitImage instanceof File)) {
          console.error('portraitImage is missing or not a File object:', finalPortraitImage);
          NotificationError({ message: 'Thiếu ảnh chân dung. Vui lòng quay lại bước 1 để upload lại.' });
          return;
        }

        const ocrFront = ocrData.data_ocr.ocr_front;
        const ocrBack = ocrData.data_ocr.ocr_back;
        
        // Parse dates từ OCR (format: DD-MM-YYYY)
        const parseDate = (dateStr: string) => {
          if (!dateStr) return { day: '', month: '', year: '' };
          const parts = dateStr.split('-');
          if (parts.length >= 3) {
            return {
              day: parts[0] || '',
              month: parts[1] || '',
              year: parts[2] || '',
            };
          }
          return { day: '', month: '', year: '' };
        };

        const tenantBirth = parseDate(ocrFront.birthday || '');
        const tenantIdIssue = parseDate(ocrFront.issue_date || '');
        const startDate = values.startDate ? dayjs(values.startDate) : dayjs();
        const endDate = values.endDate ? dayjs(values.endDate) : dayjs().add(1, 'year');
        const currentDate = dayjs();

        // Map dữ liệu từ OCR và form vào contractData
        const contractData = {
          contractLocation: values.address || ocrFront.address || 'Hà Nội',
          currentDay: currentDate.format('DD'),
          currentMonth: currentDate.format('MM'),
          currentYear: currentDate.format('YYYY'),
          ownerName: '', // Chủ nhà - có thể để trống hoặc lấy từ form khác
          ownerBirth: '',
          ownerPermanentAddress: '',
          ownerId: '',
          ownerIdIssueDay: '',
          ownerIdIssueMonth: '',
          ownerIdIssueYear: '',
          ownerIdIssuePlace: '',
          ownerPhone: '',
          tenantName: values.name || ocrFront.name || '',
          tenantBirth: ocrFront.birthday || '',
          tenantPermanentAddress: values.address || ocrFront.address || '',
          tenantId: values.idCard || ocrFront.id || '',
          tenantIdIssueDay: tenantIdIssue.day,
          tenantIdIssueMonth: tenantIdIssue.month,
          tenantIdIssueYear: tenantIdIssue.year,
          tenantIdIssuePlace: values.issueBy || ocrFront.issue_by || '',
          tenantPhone: values.phone || '',
          roomAddress: '', // Có thể lấy từ room info
          rentPrice: '',
          paymentMethod: 'Trả tiền mặt hàng tháng',
          electricPrice: '',
          waterPrice: '',
          depositAmount: '',
          startDateDay: startDate.format('DD'),
          startDateMonth: startDate.format('MM'),
          startYear: startDate.format('YYYY'),
          endDateDay: endDate.format('DD'),
          endDateMonth: endDate.format('MM'),
          endYear: endDate.format('YYYY'),
          noticeDays: '30',
        };

        const saveParams: ISaveContractParams = {
          organizationUnitId: roomId, // Giống hệt genContract - không trim
          contractData,
          frontImage: finalFrontImage,
          backImage: finalBackImage,
          portraitImage: finalPortraitImage,
        };

        // Log chi tiết trước khi gọi API
        console.log('=== Save Contract Params ===');
        console.log('organizationUnitId:', saveParams.organizationUnitId);
        console.log('frontImage:', {
          exists: !!saveParams.frontImage,
          isFile: saveParams.frontImage instanceof File,
          name: saveParams.frontImage?.name,
          size: saveParams.frontImage?.size,
          type: saveParams.frontImage?.type,
        });
        console.log('backImage:', {
          exists: !!saveParams.backImage,
          isFile: saveParams.backImage instanceof File,
          name: saveParams.backImage?.name,
          size: saveParams.backImage?.size,
          type: saveParams.backImage?.type,
        });
        console.log('portraitImage:', {
          exists: !!saveParams.portraitImage,
          isFile: saveParams.portraitImage instanceof File,
          name: saveParams.portraitImage?.name,
          size: saveParams.portraitImage?.size,
          type: saveParams.portraitImage?.type,
        });
        console.log('===========================');

        // Verify all files are File objects before calling mutation
        if (!(saveParams.frontImage instanceof File)) {
          console.error('frontImage is not a File object!', saveParams.frontImage);
          NotificationError({ message: 'Lỗi: Ảnh mặt trước không hợp lệ' });
          return;
        }
        if (!(saveParams.backImage instanceof File)) {
          console.error('backImage is not a File object!', saveParams.backImage);
          NotificationError({ message: 'Lỗi: Ảnh mặt sau không hợp lệ' });
          return;
        }
        if (!(saveParams.portraitImage instanceof File)) {
          console.error('portraitImage is not a File object!', saveParams.portraitImage);
          NotificationError({ message: 'Lỗi: Ảnh chân dung không hợp lệ' });
          return;
        }

        saveContractMutation(saveParams);
      })
      .catch((error) => {
        console.error('Validation error:', error);
        if (error?.errorFields) {
          const roomIdError = error.errorFields.find((field: any) => field.name[0] === 'roomId');
          if (roomIdError) {
            NotificationError({ message: 'Vui lòng chọn phòng' });
          } else {
            NotificationError({ message: 'Vui lòng kiểm tra lại thông tin' });
          }
        } else {
          NotificationError({ message: 'Vui lòng kiểm tra lại thông tin' });
        }
      });
  }, [form, ocrData, frontImage, backImage, portraitImage, saveContractMutation]);

  const handleBack = useCallback(() => {
    if (currentStep > StepEnum.STEP1) {
      setCurrentStep((prev) => (prev - 1) as StepEnum);
    } else {
      navigate(-1);
    }
  }, [currentStep, navigate]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (contractFileUrl) {
        URL.revokeObjectURL(contractFileUrl);
      }
    };
  }, [contractFileUrl]);

  const validateImageFile = (file: RcFile): boolean => {
    const isImage = file.type?.startsWith('image/');
    if (!isImage) {
      NotificationError({ message: 'Chỉ được upload file ảnh' });
      return false;
    }
    const maxSizeMB = UploadFileMax / 1024 / 1024;
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSizeMB) {
      NotificationError({
        message: `Kích thước file không được vượt quá ${maxSizeMB.toFixed(2)}MB`,
      });
      return false;
    }
    return true;
  };

  return {
    form,
    currentStep,
    ocrData,
    contractBlob,
    contractFileUrl,
    contractFileType,
    loadingOCR,
    loadingGenContract,
    loadingSave,
    handleNext,
    handleBack,
    handleClose,
    handleRegenContract,
    handleSaveContract,
    validateImageFile,
  };
};

