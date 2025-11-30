import { useEffect } from "react";
import { Info } from "lucide-react";

export default function AlertModal({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-green-600 text-white p-16 rounded-xl shadow-2xl w-full max-w-6xl min-h-96 flex flex-col items-center justify-center text-center">
        <Info size={120} className="mb-8 text-white" />
        <h2 className="text-8xl font-bold leading-tight">{message}</h2>
      </div>
    </div>
  );
}