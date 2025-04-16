import { Status } from './status';

export interface BookUser {
  userId: number;
  isbn: string;
  status: Status;
}
