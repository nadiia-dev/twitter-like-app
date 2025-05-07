import { PuffLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <PuffLoader size={150} className="text-blue-500" />
    </div>
  );
};

export default Spinner;
