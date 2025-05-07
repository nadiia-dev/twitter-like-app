import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-red-500 text-white rounded-md p-6 shadow-lg max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Oops</h2>
        <p className="text-lg">
          {isRouteErrorResponse(error)
            ? "This page does not exist"
            : "An unexpected error occured"}
        </p>
      </div>
    </div>
  );
};

export default Error;
