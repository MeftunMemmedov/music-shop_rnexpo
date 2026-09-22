import { deleteData, postData } from '@/api/helpers';
import { TOGGLE_WISHLIST_QUERY_KEY } from '@/constants/querykeys';
import { db } from '@/sqlite/db';
import { storagePersister } from '@/sqlite/persister';
import { WishlistMutationProps } from '@/types';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactNode } from 'react';

db.execSync(
  'CREATE TABLE IF NOT EXISTS query_cache (key TEXT PRIMARY KEY, value TEXT);',
);

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export const rootQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});

rootQueryClient.setMutationDefaults(TOGGLE_WISHLIST_QUERY_KEY, {
  scope: { id: 'wishlist-toggle' },
  networkMode: 'offlineFirst',
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  retry: (failureCount, error: any) => {
    const status = error?.response?.status;

    if (status && status < 500 && status !== 408) return false;
    return failureCount < 2;
  },
  mutationFn: async ({
    product,
    user_id,
    isAuth,
    exists,
  }: WishlistMutationProps) => {
    if (!isAuth) return;

    if (exists) {
      await deleteData('shop_wishlist', {
        product: `eq.${product.id}`,
        user_id: `eq.${user_id}`,
      });
    } else {
      try {
        await postData('shop_wishlist', {
          product: product.id,
          user_id,
        });
      } catch (err: any) {
        const isDuplicate =
          err?.response?.status === 409 ||
          err?.response?.data?.code === '23505';
        if (!isDuplicate) throw err;
      }
    }
  },
});

const TanstackQueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PersistQueryClientProvider
      client={rootQueryClient}
      persistOptions={{
        maxAge: 1000 * 60 * 60 * 24,
        persister: storagePersister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const isSuccess = query.state.status === 'success';
            const baseQueryKey = query.queryKey[0] as string;
            const allowedKeys = [
              'categories',
              'brands',
              'slides',
              'notifications',
              'wishlist',
            ];
            return (
              isSuccess &&
              typeof baseQueryKey === 'string' &&
              allowedKeys.includes(baseQueryKey)
            );
          },
          shouldDehydrateMutation: (mutation) => {
            return mutation.state.isPaused;
          },
        },
      }}
      onSuccess={async () => {
        try {
          await rootQueryClient.resumePausedMutations();
          await rootQueryClient.invalidateQueries({ queryKey: ['wishlist'] });
        } catch (error) {
          console.error('ON SUCCESS ERROR RESUMEPAUSEDMUTATIONS', error);
        }
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};

export default TanstackQueryProvider;
