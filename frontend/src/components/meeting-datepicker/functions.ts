export const transformGroupAvailabilities = (groupCommonAvailabilities: any[]) => {
  const mergedDays = new Map<string, Set<string>>();

  groupCommonAvailabilities.forEach(group => {
    group.commonAvailableSlots.forEach((slot: any) => {
      if (!mergedDays.has(slot.day)) {
        mergedDays.set(slot.day, new Set());
      }

      slot.hours.forEach((hour: string) => {
        mergedDays.get(slot.day)!.add(hour);
      });
    });
  });

  return Array.from(mergedDays.entries()).map(([day, hours]) => ({
    day,
    hours: Array.from(hours)
  }));
};
