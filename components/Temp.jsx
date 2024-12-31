import React, { useEffect } from 'react'

const Temp = () => {
    let p = 10;

    function pRun()
    {
      p=p+1;
      console.log(p)
    }
    useEffect(() => {
        console.log(`Temp component mounted and p is ${p}`)
        
        return () => {
        console.log('Temp component unmounted')
        }
    }, [p])


  return (
    <div className='bg-black text-white'>
    <h1>helllo : {p}</h1>
    <button onClick={pRun}>run </button>
    <br />
    <button onClick={()=> console.log("hello")}>submit</button>
    </div>
  )
}

export default Temp