import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = await getRepository(Transaction);

    const existsTransaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!existsTransaction) {
      throw new AppError('Impossible to delete, not found id');
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
