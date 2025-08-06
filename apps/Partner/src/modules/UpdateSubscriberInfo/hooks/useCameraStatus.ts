import { useCallback, useEffect, useState } from 'react';

export function useCameraStatus() {
  const [hasCamera, setHasCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Hàm yêu cầu camera
  const requestCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const videoTrack = mediaStream.getVideoTracks()[0];

      setStream(mediaStream);
      setHasCamera(true);

      // Track sẽ gọi onended nếu bị tắt
      videoTrack.onended = () => {
        console.log('Camera đã bị tắt');
        setHasCamera(false);
        setStream(null);
      };
    } catch (err) {
      console.warn('Không thể truy cập camera:', err);
      setHasCamera(false);
      setStream(null);
    }
  };

  // Kiểm tra có camera không
  const checkHasCamera = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoInput = devices.some((d) => d.kind === 'videoinput');

    setHasCamera(hasVideoInput);

    // Nếu camera có và chưa có stream → thử mở lại
    if (hasVideoInput && !stream) {
      await requestCamera();
    }
  }, [stream]);

  useEffect(() => {
    // Lần đầu khởi động
    requestCamera();

    // Lắng nghe khi có thiết bị thay đổi (rút cắm, enable lại, cấp quyền lại)
    navigator.mediaDevices.addEventListener('devicechange', checkHasCamera);

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        checkHasCamera
      );
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream, checkHasCamera]);

  return { hasCamera, stream, requestCamera };
}
