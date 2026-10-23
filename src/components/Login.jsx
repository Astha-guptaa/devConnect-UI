import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'

const Login = () => {
  const [email, setEmail] = useState('astha@gmail.com')
  const [password, setPassword] = useState('Astha@123')
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
      console.error('ERROR : ', err.message)
    }
  }
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <fieldset className='fieldset bg-base-content border-base-300 rounded-box w-xs border p-4'>
        <h1 className='text-center text-lg text-black font-bold'>Login</h1>

        <label className='label'>Email</label>
        <input
          type='email'
          value={email}
          className='input'
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className='label'>Password</label>
        <input
          type='password'
          value={password}
          className='input'
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className='btn btn-neutral mt-4' onClick={handleLogin}>
          Login
        </button>
      </fieldset>
    </div>
  )
}

export default Login
