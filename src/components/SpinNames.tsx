interface Props {
  spinnerNames: string[];
  spinnerCount: number;
}

const SpinNames = ({ spinnerNames, spinnerCount }: Props) => {
  return (
    <div
      className="h-full flex flex-col"
    >
      <div className="flex flex-wrap justify-center max-h-[90vh] overflow-y-auto pb-12"
      >
      {spinnerCount > 0 &&
        Array.from({ length: spinnerCount }).map((_, index) => (
          <div
            key={index}
            style={{ flex: "0 0 auto", width: "auto"}}
            >
            <div
            className="w-[200px] h-[100px] flex items-center justify-center border-2 border-gray-400 bg-gray-200 text-lg font-bold m-2"
          >
            {spinnerNames[index] || index + 1}
            </div>
          </div>
        ))}
        </div>
    </div>
  );
};

export default SpinNames;
