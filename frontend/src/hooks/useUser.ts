import { getUserAPI } from "@/api/userApi";
import { useQuery } from "@tanstack/react-query";

const useUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => getUserAPI(userId!),
    enabled: !!userId,
  });
};

export default useUser;
