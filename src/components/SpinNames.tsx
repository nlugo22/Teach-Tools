interface Props {
  // names: string[];
  spinnerNames: string[];
  spinnerCount: number;
}

const SpinNames = ({ spinnerNames, spinnerCount }: Props) => {

  return (
    <div className="d-flex flex-column justify-content-center align-items-center overflow-auto"
    style={{ 
      height: '100vh',  // Full viewport height to center vertically
      display: 'flex', 
      flexDirection: 'column',
    }}>
      <div className="row justify-content-center">
        {spinnerCount > 0 && (
          Array.from({ length: spinnerCount }).map((_, index) => (
            <div key={index} className="col-auto mb-3">
            <div className="box bg-dark text-light border p-4" 
              style={{ 
                fontSize: '30px', 
                fontWeight: 'bold', 
                textAlign: 'center', 
                whiteSpace: 'nowrap',
              }}>
              {spinnerNames[index] || "Click Spin!"}
            </div>
            </div>
          ))
        )}
    </div>
    </div>
  );
}

export default SpinNames
