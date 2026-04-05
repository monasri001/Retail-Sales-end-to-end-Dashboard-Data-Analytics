import { useQuery } from '@tanstack/react-query';
import * as api from '@/lib/api';

export const useSalesSummary = () =>
  useQuery({ queryKey: ['salesSummary'], queryFn: api.fetchSalesSummary, retry: 1 });

export const useSalesTrends = (period: string) =>
  useQuery({ queryKey: ['salesTrends', period], queryFn: () => api.fetchSalesTrends(period), retry: 1 });

export const useTopProducts = () =>
  useQuery({ queryKey: ['topProducts'], queryFn: api.fetchTopProducts, retry: 1 });

export const useDeadStock = () =>
  useQuery({ queryKey: ['deadStock'], queryFn: api.fetchDeadStock, retry: 1 });

export const useCustomerSegments = () =>
  useQuery({ queryKey: ['customerSegments'], queryFn: api.fetchCustomerSegments, retry: 1 });

export const useForecast = () =>
  useQuery({ queryKey: ['forecast'], queryFn: api.fetchForecast, retry: 1 });

export const useAIInsights = () =>
  useQuery({ queryKey: ['aiInsights'], queryFn: api.fetchAIInsights, retry: 1 });

export const useAlerts = () =>
  useQuery({ queryKey: ['alerts'], queryFn: api.fetchAlerts, retry: 1 });
