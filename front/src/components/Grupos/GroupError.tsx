import {
  FiAlertCircle,
} from "react-icons/fi";

interface Props {
    error?:string;
}

export default function GroupError({error} : Props) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-red-400 p-4">
      <FiAlertCircle size={32} className="mb-2" />
      <p className="text-center">{error}</p>
    </div>
  );
}
