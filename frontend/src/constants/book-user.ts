export interface BookUser {
  userId: number;
  isbn: string;
  status: 'read' | 'unread';
}
