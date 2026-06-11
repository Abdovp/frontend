export type AnalyticsItem = {
  productId: string;
  name: string;
  price: number;
  quantity?: number;
};

export type PurchasePayload = {
  eventId: string;
  value: number;
  items: AnalyticsItem[];
};
