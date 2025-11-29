export interface LowStockItem {
  productName: string;
  quantity: number;
  unit: string;
}

export interface RecentTransaction {
  type: 'PURCHASE' | 'SALE';
  productName: string;
  date: string;
  partyName: string;
  amount: number;
  quantity: number;
  unit: string;
}

export interface DashboardStats {
  totalInventoryValue: number;
  totalProducts: number;
  lowStockProducts: LowStockItem[];
  todayPurchases: number;
  todaySales: number;
  monthPurchases: number;
  monthSales: number;
  monthProfit: number;
  pendingPaymentsCount: number;
  pendingPaymentsAmount: number;
  pendingPurchasePayments: number;
  pendingSalePayments: number;
  recentTransactions: RecentTransaction[];
}
