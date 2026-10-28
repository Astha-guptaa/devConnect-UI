import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { removeUser } from '../utils/userSlice'
import { removeUserFromFeed } from '../utils/feedSlice'

const Navbar = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + '/logout', {}, { withCredentials: true })
      dispatch(removeUser())
      dispatch(removeUserFromFeed())
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='navbar bg-base-content shadow-sm'>
      <div className='flex-1 mx-5'>
        <Link to='/' className='text-2xl text-base-100 font-bold'>
          Dev CONNECT
        </Link>
      </div>
      {user && (
        <div className='flex gap-2 items-center'>
          <div className='text-black font-bold'>Welcome {user.firstName} !</div>
          <div className='dropdown dropdown-end'>
            <div
              tabIndex={0}
              role='button'
              className='btn btn-ghost btn-circle avatar mx-5'
            >
              <div className='w-10 rounded-full'>
                <img alt='User Photo' src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'
            >
              <li>
                <Link to='/profile' className='justify-between'>
                  Profile
                  <span className='badge'>New</span>
                </Link>
              </li>
              <li>
                <Link to='/requests' className='justify-between'>
                  Requests
                </Link>
              </li>
              <li>
                <Link to='/connections' className='justify-between'>
                  Connections
                </Link>
              </li>
              <li>
                <Link to='/logout' onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
