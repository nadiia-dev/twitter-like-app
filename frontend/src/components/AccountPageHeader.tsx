import { auth } from "@/firebase/config";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Pencil, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@/types/User";

const AccountPageHeader = ({ userData }: { userData: User }) => {
  const curUser = auth.currentUser;
  const isCurrentUser = curUser?.uid === userData.id;

  return (
    <div className="w-full">
      {userData && (
        <>
          <div className="min-h-45">
            <div className="relative bg-blue-500 h-30">
              {userData?.photoURL ? (
                <Avatar className="absolute top-15 left-4 h-30 w-30 rounded-full overflow-hidden">
                  <AvatarImage
                    src={userData?.photoURL}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                </Avatar>
              ) : (
                <User2 className="absolute top-35 left-4 h-10 w-10" />
              )}
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
