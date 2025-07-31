import { Injectable } from "@nestjs/common";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { handleUTCTime } from "../../../utils/time/handleUTCTime";

export interface TransactionGraphDataPoint {
  date: string;
  expense: number;
  income: number;
  balance: number;
}

export interface TransactionGraphData {
  data: TransactionGraphDataPoint[];
}

export interface TransactionGraphFilters {
  startDate: Date;
  endDate: Date;
}

interface FormatDatesReturn {
  formattedStartDate: Date;
  formattedEndDate: Date;
}

@Injectable()
export class TransactionGraphUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  private formatDates(startDate: Date, endDate: Date): FormatDatesReturn {
    const convertedStartDate = new Date(startDate);
    const convertedEndDate = new Date(endDate);
    convertedEndDate.setHours(23, 59, 59);

    return {
      formattedStartDate: convertedStartDate,
      formattedEndDate: handleUTCTime(convertedEndDate)
    };
  }

  async execute(
    userId: number,
    filters: TransactionGraphFilters
  ): Promise<TransactionGraphData> {
    const { startDate, endDate } = filters;
    const { formattedEndDate, formattedStartDate } = this.formatDates(
      startDate,
      endDate
    );

    const graphData = await this.transactionRepository.getTransactionGraphData(
      userId,
      { startDate: formattedStartDate, endDate: formattedEndDate }
    );

    return {
      data: graphData
    };
  }
}
