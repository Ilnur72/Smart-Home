import {
  CancelTransactionDto,
  CheckPerformTransactionDto,
  CheckTransactionDto,
  CreateTransactionDto,
  GetStatementDto,
  PerformTransactionDto,
} from '../../modules/transaction/dto/transaction.dto';

export type RequestBody =
  | CheckPerformTransactionDto
  | CreateTransactionDto
  | PerformTransactionDto
  | CancelTransactionDto
  | CheckTransactionDto
  | GetStatementDto;
