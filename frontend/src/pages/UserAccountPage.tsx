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
  const params = useParams();
  const userId = params.id;
  const { data: userData, isLoading } = useUser(userId);

  if (isLoading) return <Spinner />;

  return (
    <>
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
      <UserPosts userId={userId!} />
      <PostForm
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        user={userData}
      />
    </>
  );
};

export default UserAccountPage;
