export function isExpired( expireAt?: Date | null): boolean {
  if (!expireAt) {
    return false;
  }
  return expireAt.getTime() < Date.now();
}