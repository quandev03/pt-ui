export const downloadFile = (file: Blob, name?: string, createdDate?: string) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const padZero = (num: number) => num.toString().padStart(2, '0');

    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear()
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${day}${month}${year}${hours}${minutes}${seconds}`;
  };
  const formattedDate = createdDate && formatDate(createdDate);

  const blobFile = new Blob([file], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blobFile);
  const link = document.createElement('a');
  link.href = url;
  if(typeof file === 'string') {
    link.setAttribute('download', name ? (name || 'Danh sách gán số đặc biệt') : file );
  }
  if (file instanceof Blob ) {
    if(createdDate) {
    link.setAttribute('download', `Danh_sach_gan_so_dac_biet-${formattedDate}`);
  } else {
    link.setAttribute('download', 'Gán số đặc biệt')
    }
  }
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};
