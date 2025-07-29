import dayjs from 'dayjs';

import isBetween from 'dayjs/plugin/isBetween';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(isBetween);
dayjs.extend(minMax);

export default dayjs;
