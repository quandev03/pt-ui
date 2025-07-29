import { AnyElement } from '@react/commons/types';
import { prefixSaleService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { axiosClient } from 'apps/Partner/src/service';


const fetcher = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosClient.post<string, Blob>(
        `${prefixSaleService}/topup-package-transction/check-file-format`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return res;
};

const useCheckFileFormat = (
    form: FormInstance,
    onSuccess?: () => void
) => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: async () => {
            onSuccess?.();
        },
        onError: async (error: AnyElement) => {
            if (error.errors?.length > 0) {
                form.setFields([
                    {
                        name: 'attachment',
                        errors: [error.errors[0].detail],
                    },
                ]);
            }
        },
    });
};

export default useCheckFileFormat;
