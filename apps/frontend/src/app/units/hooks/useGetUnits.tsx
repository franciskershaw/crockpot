import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import { queryKeys } from "@/lib/constants";

const useGetUnits = () => {
  const api = useAxios();

  const getUnits = async () => {
    const response = await api.get("/api/units");
    return response.data;
  };

  const {
    data: units,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKeys.UNITS],
    queryFn: getUnits,
  });

  return { units, isLoading, error };
};

export default useGetUnits;
