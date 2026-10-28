import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequest, removeRequest } from '../utils/requestSlice'

const Requests = () => {
  const requests = useSelector((store) => store.request)
  const dispatch = useDispatch()

 const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + '/user/requests/received', {
        withCredentials: true,
      })
      dispatch(addRequest(res.data))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getRequests()
  }, [])

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + '/request/review/' + status + '/' + _id,
        {},
        { withCredentials: true },
      )
      dispatch(removeRequest(_id))
    } catch (err) {
      console.log(err)
    }
  }

  if (!requests) return

  if (!requests.data?.length)
    return <h1 className='flex justify-center my-10'>{requests.message}</h1>

  return (
    <div className='text-center my-7'>
      <h1 className='text-bold text-3xl'>Requests</h1>
      {requests?.data?.map((request) => {
        const { _id, firstName, lastName, age, gender, about, photoUrl } =
          request.fromUserId
        return (
          <div
            key={_id}
            className='w-1/2 flex p-4 mx-auto my-5 bg-base-300 rounded-2xl justify-between items-center'
          >
            <div>
              <img
                src={photoUrl}
                alt='user-photo'
                className='w-20 h-20 rounded-full'
              />
            </div>
            <div className='text-left mx-4'>
              <h2 className='text-lg font-bold'>
                {firstName + ', ' + lastName}
              </h2>
              {age && gender && (
                <p className='text-sm'>{age + ', ' + gender}</p>
              )}
              <p>{about}</p>
            </div>
            <div className=''>
              <button
                className='btn btn-secondary py-1'
                onClick={() => reviewRequest('rejected', request._id)}
              >
                Reject
              </button>
              <button
                className='btn btn-primary py-1 mx-4'
                onClick={() => reviewRequest('accepted', request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Requests
