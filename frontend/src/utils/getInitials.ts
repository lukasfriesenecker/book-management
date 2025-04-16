export function getInitials(username: string): string {
  return username.substring(0, 2).toUpperCase();
}
