import { useContext, useEffect } from 'react'
import AppContext from '../../context/AppContext'
const Profile = () => {
    let  {user,userProfile} = useContext(AppContext);
    
   useEffect(()=>{
    userProfile();
   },[])
    
   if(!user){
    return <div>Loading...</div>
   }
  return (
    <div className="flex justify-center items-center h-[92vh]">
    <div className="w-80 bg-gray-800 text-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center">
        <div className="bg-blue-500 h-16 w-16 rounded-full flex justify-center items-center text-xl font-bold uppercase">
          {user.name.slice(0, 2)}
        </div>
        <h1 className="mt-4 text-xl font-semibold">{user.name}</h1>
        <p className="text-gray-400">{user.email}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm">
          <span className="font-bold text-gray-300">User ID:</span> {user._id}
        </p>
        <p className="text-sm mt-2">
          <span className="font-bold text-gray-300">Created At:</span> {new Date(user.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  </div>
  )
}

export default Profile