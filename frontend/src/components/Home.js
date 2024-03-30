// import './Home.css'
import Header from './Header'
import Lottie from 'react-lottie';
import animationData from './img/Animation - 1711780420312.json'
import trackingAnimation from './img/Animation - tracking.json'
import scannerAnimation from './img/Animation - scanner.json'
import alertAnimation from './img/Animation - alert.json'
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
function Home(){
    const animationOptions = {
        loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const navigate = useNavigate()
    const featureRef = useRef();
    const scrollToFeacture = ()=>{
        featureRef.current.scrollIntoView({behavior:'smooth'});
    }
    const animationTracking = {
        loop: true,
      autoplay: true, 
      animationData: trackingAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const animationScanner = {
        loop: true,
      autoplay: true, 
      animationData: scannerAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const animationAlert = {
        loop: true,
        autoplay: true, 
        animationData: alertAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
            }
    }
    return(
    // <div className="home-class">
    //     This is Home page.
    // </div>
    
    <>
        <Header scrollToFeacture={scrollToFeacture}/>
        <div className='flex flex-row mx-auto w-4/6 mt-24 z-0'>
            <div className='w-3/6 self-center'>
                <div className='text-6xl text-justify self-center  font-semibold text-customeColor-300  justify-self-center'>Inventory Management Reinvented</div>
                <div className='p-1 flex'><div className='me-0.5 text-customeColor-400 font-medium text-xl'>InventoFlow</div> <p className='text-customeColor-200 text-xl font-normal'>Where Maintenance Meets Efficiency.</p></div>
                <button className='hover:bg-customeColor-200 hover:-translate-y-1 hover:scale-110 transition ease-in-out delay-50 duration-300 mt-2 px-5 py-2 rounded-xl text-white bg-customeColor-400' onClick={()=>{navigate("/signup")}}>Get Started</button>
            </div>
            <div className='w-3/6 flex flex-row'>
                <Lottie options={animationOptions} width={500} height={500}/>
            </div>
        </div>
        <div id="features" ref={featureRef} className='mt-20 mx-40'>
            <div className='flex flex-row my-0.5'>
                <div>
                    <Lottie options={animationTracking} width={400} height={400}/>
                </div>
                <div className='justify-self-center self-center'>
                    <div className='text-3xl font-normal text-customeColor-300'>Track Every Service: From Past to Present.</div>
                    <p className='text-lg text mx-5 my-2 text-customeColor-400'>InventoFlow meticulously records and organizes maintenance histories for all machines, ensuring comprehensive tracking and easy access to historical data.</p>
                </div>
            </div>
            <div className='flex flex-row my-0.5'>
                <div className='justify-self-center self-center'>
                    <div className='text-3xl font-normal text-customeColor-200'>Scan, Retrieve, Manage: Instantly.</div>
                    <p className='text-lg text mx-5 my-2 text-green-500'>With InventoFlow's QR code system, effortlessly access and manage items by simply scanning their QR codes, streamlining inventory management and enhancing efficiency.</p>
                </div>
                <div>
                    <Lottie options={animationScanner} width={400} height={400}/>
                </div>
            </div>
            <div className='flex flex-row my-0.5'>
                <div>
                    <Lottie options={animationAlert} width={400} height={400}/>
                </div>
                <div className='justify-self-center self-center'>
                    <div className='text-3xl font-normal text-customeColor-400'>Stay Ahead, Stay Notified: Seamless Service Alerts.</div>
                    <p className='text-lg text mx-5 my-2 text-customeColor-300'>InventoFlow keeps users informed with timely email notifications, ensuring they never miss an upcoming service or maintenance task, thus optimizing machine uptime and performance.</p>
                </div>
            </div>
        </div>
    </>
    );
}

export default Home;