import '../styles/SpinNames.css'

interface Props {
  // names: string[];
  selectedNames: string[];
}

const SpinNames = ({ selectedNames }: Props) => {

  return (
    <div>
      <div className="inner-container">
        {/* For loop here */}
        {selectedNames.map((name: string) =>
          <div className="box">{name}</div>
        )}
      </div>
    </div>
  );
}

export default SpinNames
