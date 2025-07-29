import { Dayjs } from 'dayjs';
import dayjs from '../../pluginDayjs';
import { DateFormat } from '@react/constants/app';

export const getDate = (date: string | undefined, format?: DateFormat) => {
  if (!date) return '';
  return dayjs(date).format(format ?? DateFormat.DEFAULT);
};

export const getDayjs = (date: string | undefined, format?: DateFormat) => {
  if (!date) return undefined;
  return dayjs(date, format);
};

export const toLocalISOString = (date: Dayjs) => {
  return date.add(7, 'h').toISOString();
};

export const toLocalString = (date: Dayjs) => {
  return date.add(7, 'h').toString();
};

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const disabledFromDate = (current: Dayjs, toDate: Dayjs) => {
  return toDate && current.isAfter(toDate, 'D');
};

export const disabledToDate = (current: Dayjs, fromDate: Dayjs) => {
  return current.isBefore(fromDate, 'D');
};

export const disabledFromTime = (current: Dayjs, toDate: Dayjs) => {
  if (toDate && current.isSame(toDate, 'D')) {
    return {
      disabledHours: () =>
        range(0, 24).splice(toDate.get('h') + 1, 24 - toDate.get('h')),
      disabledMinutes: () =>
        current.isSame(toDate, 'h')
          ? range(0, 60).splice(toDate.get('m'), 60 - toDate.get('m'))
          : [],
    };
  }

  return {};
};

export const disabledToTime = (current: Dayjs, fromDate: Dayjs) => {
  if (fromDate && current.isSame(fromDate, 'D')) {
    return {
      disabledHours: () => range(0, 24).splice(0, fromDate.get('h')),
      disabledMinutes: () =>
        current.isSame(fromDate, 'h')
          ? range(0, 60).splice(0, fromDate.get('m') + 1)
          : [],
    };
  }

  return {};
};

export const disabledBetweenDate = (
  dataTable: any[],
  current: Dayjs,
  idx: number,
  isFromDate: boolean
) => {
  // remove equal value date
  return dataTable?.some((e, index) => {
    if (index === idx) return false;
    if (e.fromDate && e.toDate) {
      return current.isBetween(e.fromDate, e.toDate, 'day', '()');
    }
    return false;
  });
};

export const disabledBetweenTime = (
  dataTable: any[],
  current: Dayjs,
  idx: number,
  isFromDate: boolean
) => {
  // remove equal value date
  let [hours, minutes]: [number[], number[]] = [[], []];
  dataTable?.forEach((e, index) => {
    if (index === idx) return;
    if (
      e.fromDate &&
      e.toDate &&
      current.isSame(e.fromDate, 'D') &&
      e.toDate.isSame(e.fromDate, 'D')
    ) {
      hours = hours.concat(
        range(0, 24).splice(e.fromDate.get('h') + 1, e.toDate.get('h') - 1)
      );
      minutes = minutes.concat(
        current.isSame(e.fromDate, 'h')
          ? range(0, 60).splice(e.fromDate.get('m'), 60 - e.fromDate.get('m'))
          : current.isSame(e.toDate, 'h')
          ? range(0, 60).splice(0, e.toDate.get('m') + 1)
          : []
      );
    }
    if (
      e.fromDate &&
      e.toDate &&
      !e.fromDate.isSame(e.toDate, 'D') &&
      current.isSame(e.fromDate, 'D')
    ) {
      (hours = hours.concat(range(0, 24).splice(e.fromDate.get('h') + 1, 24))),
        (minutes = minutes.concat(
          current.isSame(e.fromDate, 'h')
            ? range(0, 60).splice(e.fromDate.get('m'), 60 - e.fromDate.get('m'))
            : current.isSame(e.toDate, 'h')
            ? range(0, 60).splice(0, e.toDate.get('m') + 1)
            : []
        ));
    }
    if (
      e.fromDate &&
      e.toDate &&
      !e.fromDate.isSame(e.toDate, 'D') &&
      current.isSame(e.toDate, 'D')
    ) {
      hours = hours.concat(range(0, 24).splice(0, e.toDate.get('h')));
      minutes = minutes.concat(
        current.isSame(e.fromDate, 'h')
          ? range(0, 60).splice(e.fromDate.get('m'), 60 - e.fromDate.get('m'))
          : current.isSame(e.toDate, 'h')
          ? range(0, 60).splice(0, e.toDate.get('m') + 1)
          : []
      );
    }
  });
  return { disabledHours: () => hours, disabledMinutes: () => minutes };
};

export const disabledBetweenPlusDate = (
  dataTable: any[],
  current: Dayjs,
  idx: number,
  isFromDate: boolean
) => {
  // remove equal value date
  const minDates: Dayjs[] = [];
  const maxDates: Dayjs[] = [];
  const comparedDate = !isFromDate
    ? dataTable[idx]?.fromDate
    : dataTable[idx]?.toDate;
  if (!comparedDate) return false;
  dataTable?.forEach((e, index) => {
    if ((!e.fromDate && !e.toDate) || index === idx) return;
    if (dayjs(comparedDate).isBefore(e.fromDate, 'minute'))
      minDates.push(e.fromDate);
    if (dayjs(comparedDate).isAfter(e.fromDate, 'minute'))
      maxDates.push(e.fromDate);
    if (dayjs(comparedDate).isBefore(e.toDate, 'minute'))
      minDates.push(e.toDate);
    if (dayjs(comparedDate).isAfter(e.toDate, 'minute'))
      maxDates.push(e.toDate);
  });
  if (!isFromDate) {
    const minValue = dayjs.min(minDates);
    return !!minValue && current.isAfter(minValue, 'minute');
  } else {
    const maxValue = dayjs.max(maxDates);
    return !!maxValue && current.isBefore(maxValue, 'minute');
  }
};

export const disabledBetweenPlusTime = (
  dataTable: any[],
  current: Dayjs,
  idx = 0,
  isFromDate: boolean
) => {
  // remove equal value date
  const minTimes: Dayjs[] = [];
  const maxTimes: Dayjs[] = [];
  const comparedTime = !isFromDate
    ? dataTable[idx]?.fromDate
    : dataTable[idx]?.toDate;
  if (!comparedTime) return {};
  dataTable?.forEach((e, index) => {
    if ((!e.fromDate && !e.toDate) || index === idx) return;
    if (dayjs(comparedTime).isBefore(e.fromDate, 'm'))
      minTimes.push(e.fromDate);
    if (dayjs(comparedTime).isAfter(e.fromDate, 'm')) maxTimes.push(e.fromDate);
    if (dayjs(comparedTime).isBefore(e.toDate, 'm')) minTimes.push(e.toDate);
    if (dayjs(comparedTime).isAfter(e.toDate, 'm')) maxTimes.push(e.toDate);
  });
  console.log(minTimes, 'xxxxxxxxx', maxTimes, dataTable);
  if (!isFromDate) {
    const minValue = dayjs.min(minTimes);
    return minValue
      ? {
          disabledHours: () => range(0, 24).splice(minValue.get('h') + 1, 24),
          disabledMinutes: () =>
            current.isSame(minValue, 'h')
              ? range(0, 60).splice(minValue.get('m'), 60 - minValue.get('m'))
              : [],
        }
      : {};
  } else {
    const maxValue = dayjs.max(maxTimes);
    return maxValue
      ? {
          disabledHours: () => range(0, 24).splice(0, maxValue.get('h')),
          disabledMinutes: () =>
            current.isSame(maxValue, 'h')
              ? range(0, 60).splice(0, maxValue.get('m') + 1)
              : [],
        }
      : {};
  }
};
