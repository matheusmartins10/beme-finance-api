import { getRepository, getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    category,
    title,
    type,
    value,
  }: RequestDTO): Promise<Transaction> {
    // TODO
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    let categoryTitle = await categoryRepository.findOne({
      where: { title: category },
    });

    const { total } = await transactionRepository.getBalance();

    if (total < value && type === 'outcome') {
      throw new AppError('insuficient value to outcome transactions');
    }

    if (!categoryTitle) {
      categoryTitle = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryTitle);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: categoryTitle,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
