import { ItemType } from 'antd/lib/menu/interface';
import { compact } from 'lodash';
import { Link } from 'react-router-dom';
import { AnyElement, RouterItems } from '../types';

/**
 * Kiểm tra xem trang web có đang được reload hay không
 * @returns {boolean} true nếu là page reload, false nếu không
 */
export const isPageReload = (): boolean => {
  let reload = false;
  try {
    if (window.performance && window.performance.getEntriesByType) {
      const navEntries = window.performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const navEntry = navEntries[0] as PerformanceNavigationTiming;
        reload = navEntry.type === 'reload';
      }
    }
  } catch {
    reload = true;
  }
  return reload;
};

export function convertVietnameseToEnglish(text: string) {
  const vowelMap = {
    á: 'as',
    à: 'af',
    ả: 'ar',
    ã: 'ax',
    ạ: 'aj',
    ấ: 'aas',
    ầ: 'aaf',
    ẩ: 'aar',
    ẫ: 'aax',
    ậ: 'aaj',
    é: 'es',
    è: 'ef',
    ẻ: 'er',
    ẽ: 'ex',
    ẹ: 'ej',
    ế: 'ees',
    ề: 'eef',
    ể: 'eer',
    ễ: 'eex',
    ệ: 'eej',
    í: 'is',
    ì: 'if',
    ỉ: 'ir',
    ĩ: 'ix',
    ị: 'ij',
    ó: 'os',
    ò: 'of',
    ỏ: 'or',
    õ: 'ox',
    ọ: 'oj',
    ố: 'oos',
    ồ: 'oof',
    ổ: 'oor',
    ỗ: 'oox',
    ộ: 'ooj',
    ớ: 'ows',
    ờ: 'owf',
    ở: 'owr',
    ỡ: 'owx',
    ợ: 'owj',
    ú: 'us',
    ù: 'uf',
    ủ: 'ur',
    ũ: 'ux',
    ụ: 'uj',
    ứ: 'uws',
    ừ: 'uwf',
    ử: 'uwr',
    ữ: 'uwx',
    ự: 'uwj',
    ý: 'ys',
    ỳ: 'yf',
    ỷ: 'yr',
    ỹ: 'yx',
    ỵ: 'yj',
    ê: 'ee',
    â: 'aa',
    ô: 'oo',
    ơ: 'ow',
    ư: 'uw',
    Á: 'As',
    À: 'Af',
    Ả: 'Ar',
    Ã: 'Ax',
    Ạ: 'Aj',
    Ấ: 'AAs',
    Ầ: 'AAf',
    Ẩ: 'AAr',
    Ẫ: 'AAx',
    Ậ: 'AAj',
    É: 'Es',
    È: 'Ef',
    Ẻ: 'Er',
    Ẽ: 'Ex',
    Ẹ: 'Ej',
    Ế: 'EEs',
    Ề: 'EEf',
    Ể: 'EEr',
    Ễ: 'EEx',
    Ệ: 'EEj',
    Í: 'Is',
    Ì: 'If',
    Ỉ: 'Ir',
    Ĩ: 'Ix',
    Ị: 'Ij',
    Ó: 'Os',
    Ò: 'Of',
    Ỏ: 'Or',
    Õ: 'Ox',
    Ọ: 'Oj',
    Ố: 'OOs',
    Ồ: 'OOf',
    Ổ: 'OOr',
    Ỗ: 'OOx',
    Ộ: 'OOj',
    Ớ: 'OWs',
    Ờ: 'OWf',
    Ở: 'OWr',
    Ỡ: 'OWx',
    Ợ: 'OWj',
    Ú: 'Us',
    Ù: 'Uf',
    Ủ: 'Ur',
    Ũ: 'Ux',
    Ụ: 'Uj',
    Ứ: 'UWs',
    Ừ: 'UWf',
    Ử: 'UWr',
    Ữ: 'UWx',
    Ự: 'UWj',
    Ý: 'Ys',
    Ỳ: 'Yf',
    Ỷ: 'Yr',
    Ỹ: 'Yx',
    Ỵ: 'Yj',
    Ê: 'EE',
    Â: 'AA',
    Ô: 'OO',
    Ơ: 'OW',
    Ư: 'UW',
    ă: 'aw',
  };

  let result = text;
  for (const [vietnameseChar, englishChar] of Object.entries(vowelMap)) {
    result = result.replace(new RegExp(vietnameseChar, 'g'), englishChar);
  }

  return result.replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const parseValue = (val: AnyElement) => {
  if (val === 'undefined') return undefined;
  if (val === 'null') return null;
  return val;
};

export const convertMenuItemToItem = (
  { parentId, label, key, icon, hasChild }: RouterItems,
  menus: RouterItems[],
  isChildMenu?: boolean
) => {
  if (parentId && !isChildMenu) return null;
  const isLinked = !menus.some(
    (value: AnyElement) => value['parentId'] === key
  );
  const menuLabel = !isLinked ? (
    <div title={label}>{label}</div>
  ) : (
    <Link to={key} title={label}>
      {label}
    </Link>
  );
  const childrens: ItemType[] = menus
    .filter((item) => item['parentId'] === key)
    .map((subItem) => convertMenuItemToItem(subItem, menus, true));
  if (compact(childrens).length === 0 && hasChild === true) return null;
  return {
    key: key,
    icon: icon,
    children: childrens.length ? childrens : null,
    label: menuLabel,
  };
};
export const cleanUpString = (input: string) => {
  // Trim khoảng trắng đầu và cuối chuỗi
  const trimmedString = input.trim();

  // Thay thế nhiều khoảng trắng liên tiếp thành 1 khoảng trắng
  const cleanedString = trimmedString.replace(/\s\s+/g, ' ');

  return cleanedString;
};

export const handlePasteRemoveSpace = (
  event: React.ClipboardEvent<HTMLInputElement>,
  maxLength: number
) => {
  event.preventDefault();
  const paste = event.clipboardData.getData('text');
  const withoutSpaces = paste.replace(/\s+/g, '');
  const inputElement = event.currentTarget;
  const currentValue = inputElement.value;

  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;

  const beforeSelection = currentValue.substring(0, selectionStart);
  const afterSelection = currentValue.substring(selectionEnd);

  const remainingLength = maxLength - currentValue.length;
  const truncatedValue = withoutSpaces.substring(0, remainingLength);

  inputElement.setSelectionRange(
    beforeSelection.length + truncatedValue.length,
    beforeSelection.length + truncatedValue.length
  );
  inputElement.value = beforeSelection + truncatedValue + afterSelection;
};

export const handlePasteRemoveTextKeepNumber = (
  event: React.ClipboardEvent<HTMLInputElement>,
  maxLength: number
) => {
  event.preventDefault();
  const paste = event.clipboardData.getData('text');
  const onlyNumbers = paste.replace(/\D/g, '');
  const inputElement = event.currentTarget;
  const currentValue = inputElement.value;
  const selectionStart = inputElement.selectionStart ?? 0;
  const selectionEnd = inputElement.selectionEnd ?? 0;
  const beforeSelection = currentValue.substring(0, selectionStart);
  const afterSelection = currentValue.substring(selectionEnd);
  const remainingLength =
    maxLength - (beforeSelection.length + afterSelection.length);
  const truncatedValue = onlyNumbers.substring(0, remainingLength);
  inputElement.value = beforeSelection + truncatedValue + afterSelection;
  inputElement.setSelectionRange(
    beforeSelection.length + truncatedValue.length,
    beforeSelection.length + truncatedValue.length
  );
  return beforeSelection + truncatedValue + afterSelection;
};
export const removeVietnamese = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
};
