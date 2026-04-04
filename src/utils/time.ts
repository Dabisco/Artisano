export const isWithinCoolDown = (
  lastSentAt: Date | string,
  coolDownPeriodInSeconds: number,
): { isWithinCoolDownPeriod: boolean; timeRemaining: number } => {
  // get current time
  const now = new Date().getTime();
  // get last sent time
  const lastSentAtDate = new Date(lastSentAt).getTime();
  // convert cool down period to milliseconds
  const coolDownPeriod = coolDownPeriodInSeconds * 1000;
  // calculate difference between current time and last sent time
  const diff = now - lastSentAtDate;
  // calculate time remaining
  const timeRemaining = Math.ceil((coolDownPeriod - diff) / 1000);
  // return true if within cool down period
  return { isWithinCoolDownPeriod: diff < coolDownPeriod, timeRemaining };
};
