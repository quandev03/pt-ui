import { AnyElement } from '@vissoft-react/common';
import { notification } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useCameraStatus() {
  const [hasCamera, setHasCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const requestedRef = useRef(false); // Đảm bảo chỉ request 1 lần

  const requestCamera = useCallback(async () => {
    if (requestedRef.current) return; // Nếu đã gọi rồi thì không gọi lại
    requestedRef.current = true;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const videoTrack = mediaStream.getVideoTracks()[0];

      setStream(mediaStream);
      setHasCamera(true);

      videoTrack.onended = () => {
        notification.error({ message: 'Camera đã bị tắt hoặc ngắt kết nối.' });
        setHasCamera(false);
        setStream(null);
        requestedRef.current = false; // Cho phép request lại nếu bị ngắt
      };
    } catch (err: AnyElement) {
      let message = 'Đã xảy ra lỗi khi truy cập camera.';

      switch (err?.name) {
        case 'NotAllowedError':
          message = 'Bạn đã từ chối quyền truy cập camera.';
          break;
        case 'NotFoundError':
          message = 'Không tìm thấy camera trên thiết bị.';
          break;
        case 'NotReadableError':
        case 'TrackStartError':
          message = 'Camera đang được sử dụng bởi ứng dụng khác.';
          break;
        case 'OverconstrainedError':
          message = 'Không tìm thấy camera phù hợp với yêu cầu.';
          break;
        default:
          message = err?.message || message;
          break;
      }

      notification.warning({ message });
      setHasCamera(false);
      setStream(null);
      requestedRef.current = false;
    }
  }, []);

  const checkHasCamera = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoInput = devices.some((d) => d.kind === 'videoinput');

    setHasCamera(hasVideoInput);

    if (hasVideoInput && !stream) {
      await requestCamera();
    }
  }, [stream, requestCamera]);

  useEffect(() => {
    requestCamera();

    navigator.mediaDevices.addEventListener('devicechange', checkHasCamera);

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        checkHasCamera
      );
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [checkHasCamera, stream, requestCamera]);

  return { hasCamera, stream, requestCamera };
}
