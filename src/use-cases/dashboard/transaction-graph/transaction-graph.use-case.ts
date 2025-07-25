import { Injectable } from "@nestjs/common";
import { TransactionRepository } from "@domain/repositories/transaction.repository";
import { TransactionType } from "@domain/entities/transaction.entity";
import { handleUTCTime } from "../../../utils/time/handleUTCTime";
import { MILLISECONDS_IN_A_DAY } from "../../../utils/time/milliseconds";

export interface TransactionGraphDataPoint {
  date: string;
  totalAmount: number;
  transactionCount: number;
}

export interface TransactionGraphData {
  data: TransactionGraphDataPoint[];
  summary: {
    totalAmount: number;
    totalTransactions: number;
    averagePerDay: number;
  };
}

export interface TransactionGraphFilters {
  startDate: Date;
  endDate: Date;
  type?: TransactionType;
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

  private getTotalAmount(graphData: TransactionGraphDataPoint[]) {
    return graphData.reduce(
      (sum: number, point: TransactionGraphDataPoint) =>
        sum + point.totalAmount,
      0
    );
  }

  private getTotalTransactions(graphData: TransactionGraphDataPoint[]) {
    return graphData.reduce(
      (sum: number, point: TransactionGraphDataPoint) =>
        sum + point.transactionCount,
      0
    );
  }

  private getAveragePerDay(
    startDate: Date,
    endDate: Date,
    totalAmount: number
  ): number {
    const daysDifference =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / MILLISECONDS_IN_A_DAY
      ) + 1;

    const average = daysDifference > 0 ? totalAmount / daysDifference : 0;

    return Math.round(average * 100) / 100;
  }

  async execute(
    userId: number,
    filters: TransactionGraphFilters
  ): Promise<TransactionGraphData> {
    const { startDate, endDate, type } = filters;
    const { formattedEndDate, formattedStartDate } = this.formatDates(
      startDate,
      endDate
    );

    const graphData = await this.transactionRepository.getTransactionGraphData(
      userId,
      { startDate: formattedStartDate, endDate: formattedEndDate, type }
    );

    const totalAmount = this.getTotalAmount(graphData);
    const totalTransactions = this.getTotalTransactions(graphData);
    const averagePerDay = this.getAveragePerDay(
      formattedStartDate,
      formattedEndDate,
      totalAmount
    );

    return {
      data: graphData,
      summary: {
        totalAmount,
        totalTransactions,
        averagePerDay
      }
    };
  }
}
