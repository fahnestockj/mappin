import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-md  bg-white px-6 py-3 text-base font-medium text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
      onClick={() => { navigate('/') }}
    >
      <BiArrowBack className='scale-150 mr-3 ' />
      Back To Map
    </button>
  )
}
export default BackButton;