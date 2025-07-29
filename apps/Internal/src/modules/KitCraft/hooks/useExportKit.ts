import { DateFormat, FILE_TYPE } from '@react/constants/app';
import { prefixResourceService } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { Req } from './useListKit';

const exportListApi = (body: Req) => {
  return axiosClient.get<Req, Blob>(
    `${prefixResourceService}/sim-registrations/export-result`,
    { params: body, responseType: 'blob' }
  );
};

export const useExportKit = () => {
  return useMutation({
    mutationFn: exportListApi,
    onSuccess: (res: Blob) => {
      downloadFileFn(
        res,
        `Bao_cao_ghep_KIT_${dayjs().format(DateFormat.EXPORT)}`,
        FILE_TYPE.xlsx
      );
    },
  });
};
