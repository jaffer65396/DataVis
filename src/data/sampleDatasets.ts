import { Dataset, ColumnMeta, DataType } from '../types/data';

export function detectColumnMeta(data: Record<string, any>[]): ColumnMeta[] {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]);

  return keys.map((key) => {
    let nullCount = 0;
    const values: any[] = [];
    let numberCount = 0;
    let dateCount = 0;
    let boolCount = 0;

    for (let i = 0; i < data.length; i++) {
      const val = data[i][key];
      if (val === null || val === undefined || val === '') {
        nullCount++;
      } else {
        values.push(val);
        if (typeof val === 'number') {
          numberCount++;
        } else if (typeof val === 'boolean') {
          boolCount++;
        } else if (typeof val === 'string') {
          // Check if string is a number
          if (!isNaN(Number(val)) && val.trim() !== '') {
            numberCount++;
          } else if (!isNaN(Date.parse(val)) && (val.includes('-') || val.includes('/') || val.includes(':'))) {
            dateCount++;
          }
        }
      }
    }

    const nonNullCount = values.length || 1;
    let type: DataType = 'string';
    if (numberCount / nonNullCount > 0.8) {
      type = 'number';
    } else if (dateCount / nonNullCount > 0.8) {
      type = 'date';
    } else if (boolCount / nonNullCount > 0.8) {
      type = 'boolean';
    }

    // Unique values
    const uniqueSet = new Set(values);
    const uniqueCount = uniqueSet.size;

    let min: any = undefined;
    let max: any = undefined;
    let mean: number | undefined = undefined;

    if (type === 'number') {
      const nums = values.map((v) => Number(v)).filter((n) => !isNaN(n));
      if (nums.length > 0) {
        min = Math.min(...nums);
        max = Math.max(...nums);
        const sum = nums.reduce((acc, curr) => acc + curr, 0);
        mean = Math.round((sum / nums.length) * 100) / 100;
      }
    } else if (values.length > 0) {
      min = values[0];
      max = values[values.length - 1];
    }

    return {
      name: key,
      type,
      sampleValues: values.slice(0, 5),
      nullCount,
      uniqueCount,
      min,
      max,
      mean,
    };
  });
}

// 1. Enterprise Global Sales & Profit
const salesRawData = [
  { OrderId: "ORD-9401", Date: "2026-01-04", Region: "North America", Country: "United States", Segment: "Enterprise", Category: "Technology", SubCategory: "Cloud Servers", Revenue: 48500, Profit: 16200, Quantity: 12, Discount: 0.05, ShippingCost: 420 },
  { OrderId: "ORD-9402", Date: "2026-01-07", Region: "EMEA", Country: "Germany", Segment: "Corporate", Category: "Technology", SubCategory: "Laptops & Workstations", Revenue: 32400, Profit: 9100, Quantity: 24, Discount: 0.10, ShippingCost: 310 },
  { OrderId: "ORD-9403", Date: "2026-01-11", Region: "APAC", Country: "Japan", Segment: "Enterprise", Category: "Furniture", SubCategory: "Ergonomic Chairs", Revenue: 18200, Profit: 4500, Quantity: 40, Discount: 0.00, ShippingCost: 290 },
  { OrderId: "ORD-9404", Date: "2026-01-15", Region: "North America", Country: "Canada", Segment: "SMB", Category: "Office Supplies", SubCategory: "Storage & Filing", Revenue: 9400, Profit: 2800, Quantity: 35, Discount: 0.05, ShippingCost: 150 },
  { OrderId: "ORD-9405", Date: "2026-01-20", Region: "LATAM", Country: "Brazil", Segment: "Consumer", Category: "Technology", SubCategory: "Accessories", Revenue: 12600, Profit: 3900, Quantity: 55, Discount: 0.15, ShippingCost: 210 },
  { OrderId: "ORD-9406", Date: "2026-01-28", Region: "APAC", Country: "Singapore", Segment: "Corporate", Category: "Technology", SubCategory: "Cloud Servers", Revenue: 56000, Profit: 21000, Quantity: 14, Discount: 0.00, ShippingCost: 550 },
  { OrderId: "ORD-9407", Date: "2026-02-02", Region: "EMEA", Country: "United Kingdom", Segment: "Enterprise", Category: "Technology", SubCategory: "Networking", Revenue: 39500, Profit: 12800, Quantity: 18, Discount: 0.08, ShippingCost: 380 },
  { OrderId: "ORD-9408", Date: "2026-02-06", Region: "North America", Country: "United States", Segment: "Consumer", Category: "Furniture", SubCategory: "Standing Desks", Revenue: 21500, Profit: 5200, Quantity: 28, Discount: 0.12, ShippingCost: 340 },
  { OrderId: "ORD-9409", Date: "2026-02-12", Region: "APAC", Country: "Australia", Segment: "Corporate", Category: "Office Supplies", SubCategory: "Paper & Supplies", Revenue: 7800, Profit: 2400, Quantity: 60, Discount: 0.00, ShippingCost: 120 },
  { OrderId: "ORD-9410", Date: "2026-02-19", Region: "EMEA", Country: "France", Segment: "Enterprise", Category: "Technology", SubCategory: "Security Systems", Revenue: 44200, Profit: 15600, Quantity: 10, Discount: 0.05, ShippingCost: 400 },
  { OrderId: "ORD-9411", Date: "2026-02-25", Region: "LATAM", Country: "Mexico", Segment: "SMB", Category: "Technology", SubCategory: "Laptops & Workstations", Revenue: 26800, Profit: 7200, Quantity: 20, Discount: 0.10, ShippingCost: 260 },
  { OrderId: "ORD-9412", Date: "2026-03-03", Region: "North America", Country: "United States", Segment: "Enterprise", Category: "Technology", SubCategory: "Cloud Servers", Revenue: 62000, Profit: 24500, Quantity: 16, Discount: 0.04, ShippingCost: 610 },
  { OrderId: "ORD-9413", Date: "2026-03-10", Region: "APAC", Country: "India", Segment: "SMB", Category: "Furniture", SubCategory: "Ergonomic Chairs", Revenue: 15400, Profit: 3800, Quantity: 32, Discount: 0.15, ShippingCost: 230 },
  { OrderId: "ORD-9414", Date: "2026-03-18", Region: "EMEA", Country: "Netherlands", Segment: "Corporate", Category: "Technology", SubCategory: "Networking", Revenue: 31200, Profit: 9800, Quantity: 15, Discount: 0.05, ShippingCost: 290 },
  { OrderId: "ORD-9415", Date: "2026-03-24", Region: "North America", Country: "United States", Segment: "Corporate", Category: "Office Supplies", SubCategory: "Storage & Filing", Revenue: 11200, Profit: 3600, Quantity: 42, Discount: 0.00, ShippingCost: 170 },
  { OrderId: "ORD-9416", Date: "2026-04-01", Region: "APAC", Country: "Japan", Segment: "Enterprise", Category: "Technology", SubCategory: "Cloud Servers", Revenue: 59000, Profit: 22800, Quantity: 15, Discount: 0.02, ShippingCost: 580 },
  { OrderId: "ORD-9417", Date: "2026-04-09", Region: "EMEA", Country: "Germany", Segment: "SMB", Category: "Furniture", SubCategory: "Standing Desks", Revenue: 24100, Profit: 6100, Quantity: 30, Discount: 0.10, ShippingCost: 320 },
  { OrderId: "ORD-9418", Date: "2026-04-16", Region: "North America", Country: "Canada", Segment: "Enterprise", Category: "Technology", SubCategory: "Security Systems", Revenue: 47800, Profit: 17200, Quantity: 12, Discount: 0.05, ShippingCost: 450 },
  { OrderId: "ORD-9419", Date: "2026-04-22", Region: "LATAM", Country: "Chile", Segment: "Consumer", Category: "Office Supplies", SubCategory: "Paper & Supplies", Revenue: 6200, Profit: 1900, Quantity: 50, Discount: 0.00, ShippingCost: 110 },
  { OrderId: "ORD-9420", Date: "2026-04-29", Region: "APAC", Country: "Singapore", Segment: "Corporate", Category: "Technology", SubCategory: "Laptops & Workstations", Revenue: 38900, Profit: 11400, Quantity: 26, Discount: 0.08, ShippingCost: 360 }
];

// 2. SaaS Metrics & Churn
const saasRawData = [
  { CustomerId: "CUS-101", CustomerName: "Apex Logistics", Plan: "Enterprise", MRR: 3500, ARR: 42000, Users: 140, Status: "Active", NPS: 9, Region: "North America", ChurnRisk: "Low", JoinedDate: "2024-02-15" },
  { CustomerId: "CUS-102", CustomerName: "Beacon Health", Plan: "Enterprise", MRR: 4200, ARR: 50400, Users: 190, Status: "Active", NPS: 10, Region: "EMEA", ChurnRisk: "Low", JoinedDate: "2023-11-01" },
  { CustomerId: "CUS-103", CustomerName: "Crimson Media", Plan: "Pro", MRR: 850, ARR: 10200, Users: 28, Status: "At-Risk", NPS: 5, Region: "North America", ChurnRisk: "High", JoinedDate: "2025-04-10" },
  { CustomerId: "CUS-104", CustomerName: "Delta Fintech", Plan: "Enterprise", MRR: 5600, ARR: 67200, Users: 260, Status: "Active", NPS: 9, Region: "APAC", ChurnRisk: "Low", JoinedDate: "2023-08-22" },
  { CustomerId: "CUS-105", CustomerName: "Echo Retail", Plan: "Starter", MRR: 199, ARR: 2388, Users: 6, Status: "Churned", NPS: 4, Region: "EMEA", ChurnRisk: "Churned", JoinedDate: "2025-01-14" },
  { CustomerId: "CUS-106", CustomerName: "Frontier Bio", Plan: "Pro", MRR: 950, ARR: 11400, Users: 32, Status: "Active", NPS: 8, Region: "North America", ChurnRisk: "Low", JoinedDate: "2024-09-05" },
  { CustomerId: "CUS-107", CustomerName: "Genesis AI", Plan: "Enterprise", MRR: 6800, ARR: 81600, Users: 310, Status: "Active", NPS: 10, Region: "North America", ChurnRisk: "Low", JoinedDate: "2024-05-18" },
  { CustomerId: "CUS-108", CustomerName: "Horizon Labs", Plan: "Pro", MRR: 790, ARR: 9480, Users: 24, Status: "At-Risk", NPS: 6, Region: "APAC", ChurnRisk: "Medium", JoinedDate: "2025-03-01" },
  { CustomerId: "CUS-109", CustomerName: "Ironclad Security", Plan: "Enterprise", MRR: 4900, ARR: 58800, Users: 215, Status: "Active", NPS: 9, Region: "EMEA", ChurnRisk: "Low", JoinedDate: "2023-05-30" },
  { CustomerId: "CUS-110", CustomerName: "Jupiter Commerce", Plan: "Starter", MRR: 249, ARR: 2988, Users: 8, Status: "Active", NPS: 7, Region: "LATAM", ChurnRisk: "Low", JoinedDate: "2025-06-12" },
  { CustomerId: "CUS-111", CustomerName: "Krypton Energy", Plan: "Pro", MRR: 1200, ARR: 14400, Users: 45, Status: "Active", NPS: 8, Region: "EMEA", ChurnRisk: "Low", JoinedDate: "2024-10-19" },
  { CustomerId: "CUS-112", CustomerName: "Lumina Design", Plan: "Starter", MRR: 199, ARR: 2388, Users: 5, Status: "Churned", NPS: 3, Region: "North America", ChurnRisk: "Churned", JoinedDate: "2024-12-08" }
];

// 3. Global Commodities & Financial Markets
const commodityRawData = [
  { Commodity: "Gold (XAU)", Category: "Precious Metals", SpotPrice: 2895.50, Open: 2880.00, High: 2912.40, Low: 2874.20, Close: 2895.50, DailyChangePct: 0.85, Volume: 145200, Unit: "USD/oz", Region: "Global" },
  { Commodity: "Silver (XAG)", Category: "Precious Metals", SpotPrice: 34.20, Open: 33.60, High: 34.65, Low: 33.40, Close: 34.20, DailyChangePct: 1.78, Volume: 89000, Unit: "USD/oz", Region: "Global" },
  { Commodity: "Crude Oil (Brent)", Category: "Energy", SpotPrice: 82.40, Open: 83.10, High: 83.75, Low: 81.90, Close: 82.40, DailyChangePct: -0.84, Volume: 320400, Unit: "USD/bbl", Region: "North Sea" },
  { Commodity: "Crude Oil (WTI)", Category: "Energy", SpotPrice: 77.90, Open: 78.40, High: 79.10, Low: 77.20, Close: 77.90, DailyChangePct: -0.64, Volume: 285100, Unit: "USD/bbl", Region: "North America" },
  { Commodity: "Natural Gas", Category: "Energy", SpotPrice: 2.78, Open: 2.65, High: 2.84, Low: 2.62, Close: 2.78, DailyChangePct: 4.90, Volume: 112000, Unit: "USD/MMBtu", Region: "North America" },
  { Commodity: "Copper", Category: "Industrial Metals", SpotPrice: 4.62, Open: 4.55, High: 4.68, Low: 4.52, Close: 4.62, DailyChangePct: 1.54, Volume: 64200, Unit: "USD/lb", Region: "Global" },
  { Commodity: "Wheat", Category: "Agriculture", SpotPrice: 585.25, Open: 590.00, High: 594.50, Low: 582.00, Close: 585.25, DailyChangePct: -0.81, Volume: 45300, Unit: "USd/bu", Region: "Global" },
  { Commodity: "Corn", Category: "Agriculture", SpotPrice: 442.50, Open: 439.00, High: 446.00, Low: 438.00, Close: 442.50, DailyChangePct: 0.80, Volume: 51200, Unit: "USd/bu", Region: "Global" },
  { Commodity: "Soybeans", Category: "Agriculture", SpotPrice: 1180.00, Open: 1175.50, High: 1188.00, Low: 1172.00, Close: 1180.00, DailyChangePct: 0.38, Volume: 38900, Unit: "USd/bu", Region: "Global" },
  { Commodity: "Coffee (Arabica)", Category: "Agriculture", SpotPrice: 228.40, Open: 224.00, High: 231.50, Low: 222.80, Close: 228.40, DailyChangePct: 1.96, Volume: 27400, Unit: "USd/lb", Region: "South America" }
];

// 4. Financial P&L Breakdown
const financialRawData = [
  { Quarter: "2025 Q1", Year: 2025, GrossRevenue: 1240000, COGS: 420000, GrossProfit: 820000, R_and_D: 210000, SGA: 280000, OperatingIncome: 330000, Taxes: 66000, NetIncome: 264000, EBITDA: 375000 },
  { Quarter: "2025 Q2", Year: 2025, GrossRevenue: 1380000, COGS: 460000, GrossProfit: 920000, R_and_D: 230000, SGA: 305000, OperatingIncome: 385000, Taxes: 77000, NetIncome: 308000, EBITDA: 435000 },
  { Quarter: "2025 Q3", Year: 2025, GrossRevenue: 1520000, COGS: 500000, GrossProfit: 1020000, R_and_D: 255000, SGA: 330000, OperatingIncome: 435000, Taxes: 87000, NetIncome: 348000, EBITDA: 495000 },
  { Quarter: "2025 Q4", Year: 2025, GrossRevenue: 1850000, COGS: 610000, GrossProfit: 1240000, R_and_D: 290000, SGA: 390000, OperatingIncome: 560000, Taxes: 112000, NetIncome: 448000, EBITDA: 630000 },
  { Quarter: "2026 Q1", Year: 2026, GrossRevenue: 1720000, COGS: 560000, GrossProfit: 1160000, R_and_D: 310000, SGA: 370000, OperatingIncome: 480000, Taxes: 96000, NetIncome: 384000, EBITDA: 550000 },
  { Quarter: "2026 Q2 (Est)", Year: 2026, GrossRevenue: 1980000, COGS: 640000, GrossProfit: 1340000, R_and_D: 340000, SGA: 410000, OperatingIncome: 590000, Taxes: 118000, NetIncome: 472000, EBITDA: 670000 }
];

export const INITIAL_DATASETS: Dataset[] = [
  {
    id: "ds_sales_global",
    name: "Enterprise Global Sales & Profit",
    sourceType: "sample",
    sourceName: "Enterprise ERP System",
    columns: detectColumnMeta(salesRawData),
    data: salesRawData,
    rowCount: salesRawData.length,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "ds_saas_metrics",
    name: "SaaS Subscriptions & Customer Churn",
    sourceType: "sample",
    sourceName: "Stripe / Billing DB",
    columns: detectColumnMeta(saasRawData),
    data: saasRawData,
    rowCount: saasRawData.length,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "ds_commodities",
    name: "Global Commodities & Price Movements",
    sourceType: "sample",
    sourceName: "Commodities Exchange Feed",
    columns: detectColumnMeta(commodityRawData),
    data: commodityRawData,
    rowCount: commodityRawData.length,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "ds_financials",
    name: "Corporate Financial P&L Statements",
    sourceType: "sample",
    sourceName: "Financial Planning & Analysis",
    columns: detectColumnMeta(financialRawData),
    data: financialRawData,
    rowCount: financialRawData.length,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T12:00:00.000Z",
  }
];
