import React, { useEffect, useState } from 'react'





function User() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const loadUserData = ()=>{
    console.log('making the request')
    // const reqdata = {
    //   method: 'POST',
    //   headers: {
    //     'Content-type': 'application/json; charset=UTF-8',
    //   },
    // }
    // fetch('/api/user/getuserdata',reqdata)
    // .then(res=>{console.log(res); return res.json()})
    // .then(data=>{
    //   console.log('user-data',data);
      
    // })
    setIsDataLoaded(true);
  }

  useEffect(()=>{
    setTimeout(loadUserData,2000);
  }, []);
  

  
  return (
    <div>
        {
          isDataLoaded? <>users data is recived</> : <h1>loading......</h1>
        }
    </div >
  )
}

export default User