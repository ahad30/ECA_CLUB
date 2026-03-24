import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes (data is fresh for 5 mins)
      cacheTime: 10 * 60 * 1000, // 10 minutes (keep in cache for 10 mins)
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnMount: false, // Don't refetch when component mounts
      refetchOnReconnect: false, // Don't refetch on reconnect
    },
  },
});

export const QueryClientProvider = ({ children }) => {
  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
      {/* {import.meta.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </ReactQueryClientProvider>
  );
};