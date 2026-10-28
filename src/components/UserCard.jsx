import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { removeUserFromFeed } from '../utils/feedSlice'

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, age, gender, about, photoUrl } = user
  const dispatch = useDispatch()
  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + '/request/send/' + status + '/' + userId,
        {},
        { withCredentials: true },
      )
      dispatch(removeUserFromFeed(userId))
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className='card bg-base-300 w-96 shadow-sm m-10'>
      <figure>
        <img src={photoUrl} alt='User-photo' />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>
          {firstName + ' ' + lastName}
          {age && gender && (
            <div className='badge badge-xs badge-secondary'>
              {age} ({gender})
            </div>
          )}
        </h2>
        <p>{about}</p>
        <div className='card-actions justify-center mt-2'>
          <button
            className='btn btn-sm btn-error'
            onClick={() => handleSendRequest('ignored', _id)}
          >
            Ignore
          </button>
          <button
            className='btn btn-sm btn-primary'
            onClick={() => handleSendRequest('interested', _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
