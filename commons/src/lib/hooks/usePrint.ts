import { MutableRefObject } from 'react';
import { useReactToPrint } from 'react-to-print';

const usePrint = (componentRef: MutableRefObject<any>, title: string) => {
  return useReactToPrint({
    content: () => componentRef!.current,
    pageStyle: '@page { size: auto;  margin: 10mm; } }',
    documentTitle: title,
  });
};
export default usePrint;
