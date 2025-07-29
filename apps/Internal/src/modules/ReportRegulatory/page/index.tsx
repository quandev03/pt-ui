import CPagination from '@react/commons/Pagination';
import { TitleHeader, Wrapper } from '@react/commons/Template/style';
import { decodeSearchParams, queryParams } from '@react/helpers/utils';
import { Card, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useGetContentReport } from '../hooks/useGetContentReport';

const ReportPage = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: content, isLoading } = useGetContentReport(queryParams(params));
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(0);

  useEffect(() => {
    const updateIframeHeight = () => {
      if (iframeRef.current) {
        const iframeDocument =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;

        if (iframeDocument) {
          setIframeHeight(iframeDocument.documentElement.offsetHeight);
        }
      }
    };
    updateIframeHeight();

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', updateIframeHeight);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', updateIframeHeight);
      }
    };
  }, [content]);
  return (
    <Wrapper>
      <TitleHeader>Báo cáo cơ quan quản lý nhà nước</TitleHeader>
      <Header />
      <Spin spinning={isLoading}>
        <Card
          className="w-full"
          style={{
            height: iframeHeight + 80 + 'px',
            maxHeight: '80vh',
          }}
        >
          <iframe
            ref={iframeRef}
            title="report"
            srcDoc={content?.data}
            style={{
              width: '100%',
              height: iframeHeight + 'px',
              border: '0',
              maxHeight: '70vh',
            }}
          />
          <CPagination
            className="mt-2"
            pageSize={
              content?.pagination.pageSize ? +content?.pagination.pageSize : 20
            }
            current={
              content?.pagination.current ? +content?.pagination.current + 1 : 1
            }
            total={content?.pagination.total ? +content?.pagination.total : 0}
          />
        </Card>
      </Spin>
    </Wrapper>
  );
};
export default ReportPage;
