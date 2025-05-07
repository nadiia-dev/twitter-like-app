import { getUserAPI } from "@/api/userApi";
import AccountPageHeader from "@/components/AccountPageHeader";
import PostForm from "@/components/PostForm";
import RootLayout from "@/components/RootLayout";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import UserPosts from "@/components/UserPosts";
import { auth } from "@/firebase/config";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

const UserAccountPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const curUser = auth.currentUser;
  const params = useParams();
  const userId = params.id!;

  const { data: userData, isLoading } = useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => getUserAPI(userId!),
  });

  if (isLoading) return <Spinner />;

  return (
    <RootLayout>
      <AccountPageHeader userData={userData} />
      {curUser?.uid === userData.id && (
        <div className="text-center">
          <Button
            variant="default"
            className="inline-block w-30"
            onClick={() => setIsDrawerOpen(true)}
          >
            Add post
          </Button>
        </div>
      )}
      <UserPosts userId={userId} user={userData} />
      <PostForm
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        user={userData}
      />
    </RootLayout>
  );
};

export default UserAccountPage;
