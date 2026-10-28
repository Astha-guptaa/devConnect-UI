import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'

const Login = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginForm, setIsLoginForm] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + '/login',
        {
          email,
          password,
        },
        { withCredentials: true },
      )
      dispatch(addUser(res.data))
      navigate('/')
    } catch (err) {
      setError(err?.response?.data || 'Something went wrong')
    }
  }

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + '/signup',
        {
          firstName,
          lastName,
          email,
          password,
        },
        { withCredentials: true },
      )
      dispatch(addUser(res.data.data))
      navigate('/profile')
    } catch (err) {
      setError(err?.response?.data || 'Something went wrong')
    }
  }

  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <fieldset className='fieldset bg-base-content border-base-300 rounded-box w-xs border p-4'>
        <h1 className='text-center text-lg text-black font-bold'>
          {isLoginForm ? 'Login' : 'SignUp'}
        </h1>

        {!isLoginForm && (
          <>
            <label className='label text-black font-bold'>First Name</label>
            <input
              type='text'
              value={firstName}
              className='input'
              placeholder='First Name'
              onChange={(e) => setFirstName(e.target.value)}
            />

            <label className='label text-black font-bold'>Last Name</label>
            <input
              type='text'
              value={lastName}
              className='input'
              placeholder='Last Name'
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}

        <label className='label text-black font-bold'>Email</label>
        <input
          type='email'
          value={email}
          className='input'
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className='label text-black font-bold'>Password</label>
        <input
          type='password'
          value={password}
          className='input'
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className='text-xs text-red-600'>{error}</p>
        <button className='btn btn-neutral mt-4' onClick={isLoginForm ? handleLogin : handleSignUp}>
          {isLoginForm ? 'Login' : 'SignUp'}
        </button>
        <p
          className='text-xs text-black cursor-pointer underline my-1'
          onClick={() => setIsLoginForm((value) => !value)}
        >
          {isLoginForm ? 'New Here? SignUp' : 'Already a User? Login'}
        </p>
      </fieldset>
    </div>
  )
}

export default Login
