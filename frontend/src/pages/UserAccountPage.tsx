import AccountPageHeader from "@/components/AccountPageHeader";
import RootLayout from "@/components/RootLayout";
import UserPosts from "@/components/UserPosts";
import { useParams } from "react-router-dom";

const UserAccountPage = () => {
  const params = useParams();
  const userId = params.id!;

  return (
    <RootLayout>
      <AccountPageHeader userId={userId} />
      <UserPosts userId={userId} />
    </RootLayout>
  );
};

export default UserAccountPage;
