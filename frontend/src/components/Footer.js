import React from 'react'
import { Link } from 'react-router-dom'
export const Footer = () => {
  return (
    

<footer class="bg-white dark:bg-gray-900">
    <div class="mx-auto w-screen max-w-screen-xl p-4 py-6 lg:py-8">
        <div class="md:flex md:justify-between">
          <div class="mb-6 md:mb-0">
              <Link to="https://inventoflow.onrender.com/" class="flex items-center">
                  <img src={require('./img/inventoflow-high-resolution-logo-transparent-footer.png')} class="h-16 me-3" alt="InventoFlow Logo" />

                  {/* <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">InventoFlow</span> */}
              </Link>
          </div>
          <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-customeColor-300 uppercase dark:text-white">Resources</h2>
                  <ul class="text-customeColor-400 dark:text-gray-400 font-medium">
                      <li class="mb-4 hover:underline cursor-pointer" onClick={()=>{window.location.href='https://tailwindcss.com/'}}>
                          TailWinds CSS
                      </li>
                      <li class="mb-4 hover:underline cursor-pointer" onClick={()=>{window.location.href='https://lottiefiles.com/'}}>
                          Lottie Files
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-customeColor-300 uppercase dark:text-white">Follow us</h2>
                  <ul class="text-customeColor-400 dark:text-gray-400 font-medium">
                      <li className="mb-4 hover:underline cursor-pointer" onClick={()=>{window.location.href='https://github.com/MohammadKaifSaiyad/fSDPollapp/'}}>
                          Github
                      </li>
                      <li className="mb-4 hover:underline cursor-pointer" onClick={()=>{window.location.href='https://www.linkedin.com/in/mohammad-kaif-saiyad'}}>
                          LinkedIn
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-customeColor-300 uppercase dark:text-white">Features</h2>
                  <ul className="text-customeColor-400 dark:text-gray-400 font-medium">
                      <li class="mb-4 hover:underline">
                          Track Every Service
                      </li>
                      <li className='hover:underline mb-4'>
                          Scan, Retrieve, Manage
                      </li>
                      <li className='hover:underline'>
                        Stay Ahead, Stay Notified
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <Link to="https://inventoflow.onrender.com/" class="hover:underline">InventoFlow™</Link>. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
          </div>
      </div>
    </div>
</footer>

  )
}
