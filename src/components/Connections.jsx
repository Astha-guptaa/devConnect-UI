import { useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../utils/connectionSlice'

const Connections = () => {
  const connections = useSelector((store) => store.connection)
  const dispatch = useDispatch()

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + '/user/connections', {
        withCredentials: true,
      })
      dispatch(addConnection(res.data))
    } catch (err) {
      console.log(err.response.message)
    }
  }

  useEffect(() => {
    getConnections()
  }, [])

  if (!connections) return

  if (connections.length === 0) return <h1 className='flex justify-center my-10'>No Connections Found!!!</h1>

  return (
    <div className='text-center my-7'>
      <h1 className='text-bold text-3xl'>Connections</h1>
      {connections.data.map((connection) => {
        const {_id, firstName, lastName, age, gender, about, photoUrl } = connection
        return (
          <div key={_id} className='w-1/2 flex p-4 mx-auto my-5 bg-base-300 rounded-2xl'>
            <div>
              <img
                src={photoUrl}
                alt='user-photo'
                className='w-20 h-20 rounded-full'
              />
            </div>
            <div className='text-left mx-4'>
              <h2 className='text-lg font-bold'>
                {firstName + ' ' + lastName}
              </h2>
              {age && gender && (
                <p className='text-sm'>{age + ', ' + gender}</p>
              )}
              <p>{about}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Connections
