export const CHANNEL_TYPES = {
  WEB_BCSS: 'WEB_BCSS',
  WEB_PARTNER: 'WEB_PARTNER',
  APP_VNSKY: 'APP_VNSKY',
  APP_SKYSALE: 'APP_SKYSALE'
} as const;

export const CHANNEL_LABELS = {
  WEB_BCSS: 'Kênh Web BCSS',
  WEB_PARTNER: 'Kênh Web đối tác',
  APP_VNSKY: 'Kênh App VNSKY',
  APP_SKYSALE: 'Kênh App đối tác'
} as const;

export const parseActiveChannels = (activeChannel: string | null): string[] => {
  if (!activeChannel) return [];
  return activeChannel.split(',').map(ch => ch.trim()).filter(ch => ch.length > 0);
};

export const isChannelActive = (activeChannel: string | null, channel: string): boolean => {
  return parseActiveChannels(activeChannel).includes(channel);
};

export const getAvailableChannels = (data: Array<{ channels?: string }>): string[] => {
  if (!data || data.length === 0) {
    return [];
  }

  const allChannels = data.reduce((acc, item) => {
    if (item.channels) {
      const channelArray = item.channels.split(',').map(ch => ch.trim()).filter(ch => ch.length > 0);
      return [...acc, ...channelArray];
    }
    return acc;
  }, [] as string[]);

  return [...new Set(allChannels)].filter(channel =>
    Object.values(CHANNEL_TYPES).includes(channel as any)
  );
};

export const isChannelAvailable = (configItem: { channels?: string }, channel: string): boolean => {
  if (!configItem?.channels) {
    return false;
  }

  if (configItem.channels.trim() === '') {
    return false;
  }

  const channelArray = configItem.channels.split(',').map(ch => ch.trim()).filter(ch => ch.length > 0);
  return channelArray.includes(channel);
};
