const UserCard = ({ user }) => {
  const { firstName, lastName, age, gender, about, photoUrl } = user
  return (
    <div className='card bg-base-300 w-96 shadow-sm m-10'>
      <figure>
        <img src={photoUrl} alt='Shoes' />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>
          {firstName + ' ' + lastName}
          <div className='badge badge-xs badge-secondary'>
            {age} ({gender})
          </div>
        </h2>
        <p>{about}</p>
        <div className='card-actions justify-center mt-2'>
          <button className='btn btn-sm btn-error'>Ignore</button>
          <button className='btn btn-sm btn-primary'>Interested</button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
