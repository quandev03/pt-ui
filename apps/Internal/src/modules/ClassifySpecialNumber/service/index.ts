import { axiosClient } from 'apps/Internal/src/service';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';
import { prefixResourceService } from '@react/url/app';

export const ClassifyNumberService = {
    getNumberInfo: async (isdn: string) => {
        return axiosClient.get<any, INumberTransactionDetail>(
            `${prefixResourceService}/lookup-number/${isdn}`
        );
    }
}
