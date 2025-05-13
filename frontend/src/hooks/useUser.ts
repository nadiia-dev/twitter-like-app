import { getMyProfileAPI, getUserAPI } from "@/api/userApi";
import { useQuery } from "@tanstack/react-query";

const useUser = (isMyProfile: boolean, userId: string) => {
  return useQuery({
    queryKey: ["getUser", isMyProfile ? "" : userId],
    queryFn: () => (isMyProfile ? getMyProfileAPI() : getUserAPI(userId)),
    enabled: !!userId,
  });
};

export default useUser;
