import { useContext } from "react";
import { SocketContext } from "../providers/SocketProvider";

const Contribute = () => {
  const { isMap, isChat } = useContext(SocketContext);

  // ✅ If either is true, return null (hide this page)
  if (isChat || isMap) return null;

  const VITE_REPO = import.meta.env.VITE_REPO;

  const handleContributeClick = () => {
    window.open(VITE_REPO, '_blank');
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <button
        onClick={handleContributeClick}
        className="bg-blue-500 text-white px-6 py-3 rounded-full text-xl hover:bg-blue-700 transition duration-300"
      >
        Contribute to This Project
      </button>
    </div>
  );
};

export default Contribute;
