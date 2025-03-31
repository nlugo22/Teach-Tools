interface Props {
  // names: string[];
  spinnerNames: string[];
  spinnerCount: number;
}

const SpinNames = ({ spinnerNames, spinnerCount }: Props) => {

  return (
    <div className="d-flex flex-column justify-content-center"
    style={{ 
      flexDirection: "column",
      height: "100vh",
    }}>
      <div className="row justify-content-center" style={{overflowY: "auto"}}>
        {spinnerCount > 0 && (
          Array.from({ length: spinnerCount }).map((_, index) => (
            <div key={index} className="col-auto mb-3">
            <div className="box bg-dark text-light border p-4" 
              style={{ 
                fontSize: '30px', 
                fontWeight: 'bold', 
                textAlign: 'center', 
                whiteSpace: 'nowrap',
                width: '200px',
                overflow: 'hidden',
              }}>
              {spinnerNames[index] || index + 1}
            </div>
            </div>
          ))
        )}
    </div>
    </div>
  );
}

export default SpinNames
