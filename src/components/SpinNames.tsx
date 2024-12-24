import '../styles/SpinNames.css'

interface Props {
  // names: string[];
  spinnerNames: string[];
  spinnerCount: number;
}

const SpinNames = ({ spinnerNames, spinnerCount }: Props) => {


  return (
    <div className="outer-container">
      <div className="inner-container">
        {/* For loop here */}
        {Array.from({ length: spinnerCount }).map((_, index) => (
          <div key={index} className="box">
            {spinnerNames[index] || "Click Spin!"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpinNames
