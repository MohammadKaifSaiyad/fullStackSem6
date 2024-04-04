import React, { useState } from 'react'
import constactusAnimeData from './img/Animation - contact.json'
import Lottie from 'react-lottie'
import Header from './Header'
import { toast, ToastContainer } from 'react-toastify'

const Contact = () => {
    const animationContact = {
        loop: true,
        autoPlay: true,
        animationData: constactusAnimeData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const [data, setData] = useState({
        userEmail:"",
        subject:"",
        message:""
    });
    const handleOnChange = (e)=>{
        setData((pre)=>({...pre, [e.target.name]: e.target.value}))
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log('form data', data);
        const options = {
            method:'POST',
            headers:{'content-type': 'application/json'},
            credentials:'include',
            body:await JSON.stringify(data)
        }
        fetch('https://inventoflow.onrender.com/api/send-email',options)
        .then(res=>res.json())
        .then(data=>{
            if(data.status === 'SUCCESS'){

            }else{
                toast.error(data.message);
                console.error(data.message);
            }
        })
    }
  return (
    <div>
        <ToastContainer/>
        <Header/>
        <div className='text-3xl font-medium mt-8 text-center text-customeColor-400'>Contact Us</div>
            <div className='flex flex-row mt-10 mx-16 justify-items-center items-center'>
                <div className='w-3/6'>
                    <form onSubmit={handleSubmit} className="space-y-8 w-5/6">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-300">Your Email</label>
                            <input type="email" id="email" name="userEmail" value={data.userEmail} onChange={handleOnChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@abc.com" required/>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-300">Subject</label>
                            <input type="text" id="subject" name="subject" value={data.subject} onChange={handleOnChange} className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required/>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-400">Your message</label>
                            <textarea id="message" rows="6" name="message" value={data.message} onChange={handleOnChange} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
                        </div>
                        <button type='submit' className='bg-customeColor-400 text-white px-5 py-2 font-medium text-md rounded-lg border-2'>Send Message</button>
                    {/* <button type="submit" className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send message</button> */}
                    </form>
                </div>
                <div className='w-3/6'>
                    <Lottie options={animationContact}/>
                </div>
            </div>
    </div>
  )
}

export default Contact