import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { AnyElement } from '@react/commons/types';
import { Badge, Popover, Spin, Tooltip } from 'antd';
import { messaging } from 'apps/Internal/src/service/firebase';
import dayjs from 'dayjs';
import { onMessage } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import {
  useInfinityScrollNotification,
  useReadAllNotification,
  useReadOneNotification,
} from '../../queryHooks';
import useConfigAppStore from '../../store';
import { INotification } from '../../types';
import { IconNoti, StyledNoNotify, StyledTitleNoti } from '../styled';
import { formatDateTime } from '@react/constants/moment';

const Notification = ({ listNotiRef }: AnyElement) => {
  const intl = useIntl();
  const { showNotify, setShowNotify } = useConfigAppStore();
  const [typeNotify, setTypeNotify] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  const {
    data: notificationList = { data: [], total: 0 },
    fetchNextPage: userFetchNextPage,
    hasNextPage: userHasNextPage,
    isLoading,
    refetch: refetchNotification,
  } = useInfinityScrollNotification({ limit: 20, seen: typeNotify === 'all' });
  useEffect(() => {
    return onMessage(messaging, (msg: any) => {
      refetchNotification();
    });
  }, []);

  const { mutate: readOneNotification } = useReadOneNotification();
  const { mutate: readAllNotification } = useReadAllNotification();

  const handleGetMore = () => {
    if (!showNotify || !userHasNextPage || isLoading) return;
    userFetchNextPage();
  };

  const handleSetShowNotify = () => {
    setShowNotify(!showNotify);
  };

  const handleCloseNotify = () => {
    setShowNotify(false);
  };

  const handleClickNotify = (item: INotification) => {
    readOneNotification(item.id);
    if (item.uriRef) {
      navigate(item.uriRef.substring(2));
    }
  };

  const handleReadAll = () => {
    readAllNotification();
  };
  const formatTimeAgo = (date: string | Date) => {
    const now = dayjs();
    const messageTime = dayjs(date);
    const diffSeconds = now.diff(messageTime, 'second');
    const diffMinutes = now.diff(messageTime, 'minute');
    const diffHours = now.diff(messageTime, 'hour');
    const isSameDay = now.isSame(messageTime, 'day');
    if (diffSeconds < 60) {
      return 'Vừa xong';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes} phút trước`;
    }
    if (diffHours < 24 && isSameDay) {
      return `${diffHours} giờ trước`;
    }
    return messageTime.format(formatDateTime);
  };

  const content = (
    <div>
      <StyledTitleNoti>
        <b>{intl.formatMessage({ id: 'common.notify' })}</b>
        <div className="flex items-center gap-2">
          <CloseOutlined
            className="text-[#666] hover:bg-[#eee] p-2 rounded-full cursor-pointer"
            onClick={handleCloseNotify}
          />
        </div>
      </StyledTitleNoti>

      <div className="flex gap-3 px-3 py-2 justify-between items-center">
        <div className="flex gap-2">
          <div
            className={`flex items-center gap-2 rounded-3xl px-3 py-1 cursor-pointer transition-all duration-300 ease-in-out ${
              typeNotify === 'all'
                ? 'bg-primary text-white'
                : 'hover:bg-primary hover:text-white'
            }`}
            onClick={() => {
              setTypeNotify('all');
            }}
          >
            Tất cả
          </div>
          <div
            className={`flex items-center gap-2 rounded-3xl px-3 py-1 cursor-pointer transition-all duration-400 ease-in-out ${
              typeNotify === 'unread'
                ? 'bg-primary text-white'
                : 'hover:bg-primary hover:text-white'
            }`}
            onClick={() => {
              setTypeNotify('unread');
            }}
          >
            Chưa đọc
          </div>
        </div>
        <div
          className="flex items-center gap-1 w-max cursor-pointer text-[#1163AE]"
          onClick={handleReadAll}
        >
          <CheckCircleOutlined color="red" />
          <p className="underline">Đọc tất cả</p>
        </div>
      </div>

      <div className="px-3 py-2 ">
        <InfiniteScroll
          dataLength={notificationList?.data.length}
          next={handleGetMore}
          hasMore={true}
          loader={<Spin spinning={isLoading} />}
          height={'100%'}
          style={{ maxHeight: '550px' }}
          scrollThreshold={'100%'}
          ref={listNotiRef}
          className="flex flex-col gap-2"
        >
          {notificationList?.data?.length === 0 ? (
            <StyledNoNotify className="">
              {intl.formatMessage({ id: 'layout.header.noNotify' })}
            </StyledNoNotify>
          ) : (
            notificationList?.data.map((item) => (
              <Tooltip title={item.content} placement="topLeft">
                <div
                  key={item.id}
                  onClick={() => handleClickNotify(item)}
                  className={`p-2 rounded-md hover:bg-[#f7f7f7] cursor-pointer transition-all duration-400 ease-in-out border border-[#eee] flex flex-col gap-2 ${
                    !item.seen ? 'bg-[#eee]' : 'bg-white'
                  }`}
                >
                  <div className="text-[#666] mt-1 line-clamp-2">
                    {item.content}
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[#1163AE] text-xs">
                      {formatTimeAgo(item.sendDate)}
                    </span>
                  </div>
                </div>
              </Tooltip>
            ))
          )}
        </InfiniteScroll>
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      content={content}
      trigger={'click'}
      open={showNotify}
      onOpenChange={(visible) => setShowNotify(visible)}
      styles={{ body: { padding: 0, width: 400, minWidth: 400 } }}
    >
      <Badge count={notificationList.total || 0}>
        <IconNoti onClick={handleSetShowNotify} />
      </Badge>
    </Popover>
  );
};

export default Notification;
