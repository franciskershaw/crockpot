import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import { queryKeys } from "@/lib/constants";

const useGetTimeRange = () => {
  const api = useAxios();

  const getTimeRange = async () => {
    const response = await api.get("/api/recipes/time-range");
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.TIME_RANGE],
    queryFn: getTimeRange,
  });

  return { data, isLoading };
};

export default useGetTimeRange;
