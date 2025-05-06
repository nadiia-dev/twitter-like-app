import { getUserAPI } from "@/api/userApi";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/firebase/config";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const AccountPageHeader = ({ userId }: { userId: string }) => {
  const curUser = auth.currentUser;
  const isCurrentUser = curUser?.uid === userId;
  const { data: userData, isLoading } = useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => getUserAPI(userId!),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-full">
      {userData && (
        <>
          <div className="min-h-45">
            <div className="relative bg-blue-500 h-30">
              <Avatar className="absolute top-15 left-4 h-30 w-30 rounded-full overflow-hidden">
                <AvatarImage
                  src={userData?.photoURL}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </Avatar>
              {isCurrentUser && (
                <div className="absolute right-4 top-35">
                  <Link to="/settings">
                    <Pencil />
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="m-2.5">
            <h2 className="font-bold text-xl font-orbitron">{userData.name}</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountPageHeader;
