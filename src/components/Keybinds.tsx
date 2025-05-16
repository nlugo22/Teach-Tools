
interface Props {
    onClose: () => void;
}

const Keybinds = ({onClose}: Props) => {
  return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full text-center">
            <button 
                onClick={onClose} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Close
            </button>
          </div> 
      </div>
  )
}

export default Keybinds
