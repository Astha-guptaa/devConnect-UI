import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import UserCard from './UserCard'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName || '')
  const [age, setAge] = useState(user.age || '')
  const [gender, setGender] = useState(user.gender || '')
  const [about, setAbout] = useState(user.about || '')
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const dispatch = useDispatch()

  const handleUpdateProfile = async () => {
    setError('')
    try {
      const res = await axios.patch(
        BASE_URL + '/profile/edit',
        { firstName, lastName, age, gender, about, photoUrl },
        { withCredentials: true },
      )
      dispatch(addUser(res.data.data))
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err.response.data)
    }
  }
  return (
    <>
      <div className='flex justify-center '>
        <div className='flex min-h-[60vh] items-center justify-center mx-10'>
          <fieldset className='fieldset bg-base-content border-base-300 rounded-box w-xs gap-0 border p-4'>
            <h1 className='text-center text-lg text-black font-bold'>
              Profile
            </h1>

            <label className='label'>First Name</label>
            <input
              type='text'
              value={firstName}
              className='input'
              placeholder='First Name'
              onChange={(e) => setFirstName(e.target.value)}
            />

            <label className='label'>Last Name</label>
            <input
              type='text'
              value={lastName}
              className='input'
              placeholder='Last Name'
              onChange={(e) => setLastName(e.target.value)}
            />
            <label className='label'>Age</label>
            <input
              type='number'
              value={age}
              className='input'
              placeholder='Age'
              onChange={(e) => setAge(e.target.value)}
            />

            <label className='label'>Gender</label>
            <select
              value={gender}
              className='select'
              onChange={(e) => setGender(e.target.value)}
            >
              <option value='' disabled>
                Gender
              </option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>

            <label className='label'>About</label>
            <textarea
              type='text'
              value={about}
              className='textarea'
              placeholder='About'
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>

            <label className='label'>PhotoUrl</label>
            <input
              type='text'
              value={photoUrl}
              className='input'
              placeholder='PhotoUrl'
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
            <p className='text-xs text-red-600'>{error}</p>
            <button
              className='btn btn-primary mt-4'
              onClick={handleUpdateProfile}
            >
              Update Profile
            </button>
          </fieldset>
        </div>
        <UserCard
          user={{ firstName, lastName, age, gender, about, photoUrl }}
        />
      </div>
      {success && (
        <div className='toast toast-bottom toast-center mb-10'>
          <div className='alert alert-success'>
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}
    </>
  )
}

export default EditProfile
