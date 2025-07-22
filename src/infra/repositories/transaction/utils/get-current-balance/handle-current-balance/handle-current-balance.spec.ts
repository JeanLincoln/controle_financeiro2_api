import { handleCurrentAndLastVariations } from "./handle-current-balance";

describe("handleCurrentAndLastVariations", () => {
  describe("Percentage variations with division by zero scenarios", () => {
    it("should return null when both current and previous values are zero", () => {
      const result = handleCurrentAndLastVariations({
        currentMonthTotalExpensesAmount: 0,
        lastMonthTotalExpensesAmount: 0,
        currentMonthTotalIncomesAmount: 0,
        lastMonthTotalIncomesAmount: 0
      });

      expect(result.expensesPercentageVariation).toBeNull();
      expect(result.incomesPercentageVariation).toBeNull();
      expect(result.balancePercentageVariation).toBeNull();
    });

    it("should return null when previous value is zero and current is greater than zero (infinite growth)", () => {
      const result = handleCurrentAndLastVariations({
        currentMonthTotalExpensesAmount: 100,
        lastMonthTotalExpensesAmount: 0,
        currentMonthTotalIncomesAmount: 200,
        lastMonthTotalIncomesAmount: 0
      });

      expect(result.expensesPercentageVariation).toBe(null);
      expect(result.incomesPercentageVariation).toBe(null);
    });

    it("should return -100 when previous value is greater than zero and current is zero (total drop)", () => {
      const result = handleCurrentAndLastVariations({
        currentMonthTotalExpensesAmount: 0,
        lastMonthTotalExpensesAmount: 100,
        currentMonthTotalIncomesAmount: 0,
        lastMonthTotalIncomesAmount: 200
      });

      expect(result.expensesPercentageVariation).toBe(null);
      expect(result.incomesPercentageVariation).toBe(null);
    });

    it("should calculate normal percentage when both values are greater than zero", () => {
      const result = handleCurrentAndLastVariations({
        currentMonthTotalExpensesAmount: 120,
        lastMonthTotalExpensesAmount: 100,
        currentMonthTotalIncomesAmount: 180,
        lastMonthTotalIncomesAmount: 225
      });

      expect(result.expensesPercentageVariation).toBe(20);
      expect(result.incomesPercentageVariation).toBe(-20);
    });

    it("should handle balance percentage correctly with mixed scenarios", () => {
      const result = handleCurrentAndLastVariations({
        currentMonthTotalIncomesAmount: 0,
        currentMonthTotalExpensesAmount: 50,
        lastMonthTotalIncomesAmount: 200,
        lastMonthTotalExpensesAmount: 100
      });

      expect(result.balancePercentageVariation).toBe(-150);
    });

    it("should handle balance percentage when previous balance was zero", () => {
      const result = handleCurrentAndLastVariations({
        currentMonthTotalIncomesAmount: 200,
        currentMonthTotalExpensesAmount: 100,
        lastMonthTotalIncomesAmount: 100,
        lastMonthTotalExpensesAmount: 100
      });

      expect(result.balancePercentageVariation).toBe(null);
    });
  });

  describe("Total variations (absolute values)", () => {
    it("should calculate correct absolute variations", () => {
      const result = handleCurrentAndLastVariations({
        currentMonthTotalExpensesAmount: 120,
        lastMonthTotalExpensesAmount: 100,
        currentMonthTotalIncomesAmount: 180,
        lastMonthTotalIncomesAmount: 200
      });

      expect(result.expensesVariation).toBe(20);
      expect(result.incomesVariation).toBe(-20);
      expect(result.balanceVariation).toBe(-40);
    });
  });
});
