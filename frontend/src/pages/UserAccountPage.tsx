import AccountPageHeader from "@/components/AccountPageHeader";
import PostForm from "@/components/PostForm";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import UserPosts from "@/components/UserPosts";
import { auth } from "@/firebase/config";
import useUser from "@/hooks/useUser";
import { useState } from "react";
import { useParams } from "react-router-dom";

const UserAccountPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const curUser = auth.currentUser;
  const currentUserId = curUser?.uid;
  const params = useParams();
  const routeId = params.id;
  const isMyProfile = currentUserId === routeId;
  const { data: userData, isLoading } = useUser(isMyProfile, routeId!);

  if (isLoading) return <Spinner />;

  return (
    <>
      <AccountPageHeader userData={userData} />
      {isMyProfile && (
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
      <UserPosts userId={userData.id!} />
      <PostForm isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
    </>
  );
};

export default UserAccountPage;
