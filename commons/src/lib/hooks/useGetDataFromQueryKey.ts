import { useQueryClient } from '@tanstack/react-query';

const useGetDataFromQueryKey = <T>(name: any[]) => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(name) as T;
};

export default useGetDataFromQueryKey;