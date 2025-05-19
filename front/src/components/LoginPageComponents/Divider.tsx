type DividerProps = {
  texto: string;
}

export default function Divider({ texto }: DividerProps) {
    return (
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-300 text-sm font-medium">
          {texto}
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
    );
  };
  
  