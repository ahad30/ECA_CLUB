import { FaTrash } from "react-icons/fa"

const DeleteModal = ({
  showModal, 
  setShowModal,
  handleDelete,
  comment,

}) => {
 
  return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FaTrash className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete this comment?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
             
              onClick={()=> handleDelete(comment?._id)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
             Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal