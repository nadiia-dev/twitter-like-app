import { getPostByIdAPI } from "@/api/postApi";
import RootLayout from "@/components/RootLayout";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Post = () => {
  const params = useParams();
  const postId = params.id!;

  const { data: postData, isLoading } = useQuery({
    queryKey: ["postById"],
    queryFn: () => getPostByIdAPI(postId),
  });

  console.log(postData);

  if (isLoading) return <p>Loading...</p>;

  return (
    <RootLayout>
      <h1 className="font-bold text-3xl font-orbitron">Thred</h1>
    </RootLayout>
  );
};

export default Post;
