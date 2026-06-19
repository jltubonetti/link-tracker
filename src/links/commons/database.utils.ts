export function isUniqueConstraint(error: any): boolean {
  return (
    error?.driverError?.code === 'SQLITE_CONSTRAINT_UNIQUE'
  );
}