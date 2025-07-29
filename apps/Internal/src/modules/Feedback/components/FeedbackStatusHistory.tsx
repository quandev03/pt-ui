import { CTable } from '@react/commons/index';
import { TableProps, Tooltip } from 'antd';
import { Text, TextLink } from '@react/commons/Template/style';
import dayjs from 'dayjs';
import { formatDateTime } from '@react/constants/moment';
import { useExportMutation } from 'apps/Internal/src/hooks/useExportMutation';
import { prefixCustomerService } from '@react/url/app';
import { useState } from 'react';
import ModalPdf from './ModalPdf';
import ModalImage from './ModalImage';
import { useGetImage } from 'apps/Internal/src/components/layouts/queryHooks';

export const FeedbackStatusHistory = ({
  listAction,
}: {
  listAction: any[];
}) => {
  const [attachFileUrl, setAttachFileUrl] = useState<string | undefined>();
  const [isOpenImage, setIsOpenImage] = useState<boolean>(false);
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);
  const { data: attachFileSrc } = useGetImage(attachFileUrl || '');

  const { mutate: exportMutate } = useExportMutation();
  const getNameFile = (fileName: string) => {
    return fileName
      ?.split('/')
      .slice(4)
      .join('_')
      .split('-')
      .slice(1)
      .join('_');
  };
  const handleDownloadTemplate = (fileUrl: string) => {
    if (!fileUrl) return;
    const fileName = getNameFile(fileUrl);
    if (
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.xls')
    ) {
      exportMutate({
        uri: `${prefixCustomerService}/file/${fileUrl}`,
        filename: fileName,
      });
    } else {
      setAttachFileUrl(fileUrl);
      if (fileName.endsWith('.pdf')) {
        setIsOpenPdf(true);
      } else {
        setIsOpenImage(true);
      }
    }
  };

  const collumnHistoryFeedback: TableProps['columns'] = [
    {
      title: 'STT',
      align: 'left',
      width: 50,
      render(_, record, index) {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: 'User xử lý',
      dataIndex: 'actionUser',
      width: 180,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'File đính kèm',
      dataIndex: 'paths',
      width: 200,
      render(value, record) {
        return (
          <div>
            {value?.map((e: string) => (
              <Tooltip title={getNameFile(e)} placement="topLeft">
                <TextLink onClick={() => handleDownloadTemplate(e)}>
                  {getNameFile(e)}
                </TextLink>
              </Tooltip>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Thời gian xử lý',
      dataIndex: 'actionTime',
      width: 160,
      render(value, record) {
        return (
          <Tooltip
            title={dayjs(value).format(formatDateTime)}
            placement="topLeft"
          >
            <Text>{dayjs(value).format(formatDateTime)}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Nội dung xử lý',
      dataIndex: 'actionContent',
      width: 400,
      render(value, record) {
        return (
          <Tooltip title={value} placement="topLeft">
            <Text>{value}</Text>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <CTable
        scroll={{ y: 325 }}
        rowKey={'id'}
        columns={collumnHistoryFeedback}
        dataSource={listAction}
        style={{ marginBottom: 16 }}
      ></CTable>{' '}
      <ModalPdf
        isOpen={isOpenPdf}
        setIsOpen={setIsOpenPdf}
        src={attachFileSrc as string}
      />
      <ModalImage
        isOpen={isOpenImage}
        setIsOpen={setIsOpenImage}
        src={attachFileSrc as string}
      />
    </>
  );
};
