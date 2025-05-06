import { getUserAPI } from "@/api/userApi";
import AccountPageHeader from "@/components/AccountPageHeader";
import RootLayout from "@/components/RootLayout";
import UserPosts from "@/components/UserPosts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const UserAccountPage = () => {
  const params = useParams();
  const userId = params.id!;

  const { data: userData, isLoading } = useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => getUserAPI(userId!),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <RootLayout>
      <AccountPageHeader userData={userData} />
      <UserPosts userId={userId} user={userData} />
    </RootLayout>
  );
};

export default UserAccountPage;
