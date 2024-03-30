// import './Header.css'
import { Link } from 'react-router-dom';

function Header({scrollToFeacture}){
    return(<>
    <header className="bg-customeColor-300 flex flex-row p-2 w-full sticky top-0 z-40">
        <div className='w-3/6'>
            <Link to='/' className=''><img className='h-14 ml-2 transition ease-in-out duration-300 hover:-translate-y-1' src={require('./img/logo-white-transparent.png')}/></Link>
        </div>
        <nav class="items-center justify-items-center justify-around flex w-3/6 mx-10 font-medium text-lg text-white">
            <Link to="/" className='hover:text-customeColor-400 hover:border-b-2 hover:border-customeColor-400 hover:rounded-sm  border-scale-0 hover:-translate-y-1 transition ease-in-out  duration-300'>Home</Link>
            <Link to="/#features" onClick={scrollToFeacture} className='hover:text-customeColor-400 hover:border-b-2 hover:border-customeColor-400 hover:rounded-sm hover:-translate-y-1 transition ease-in-out  duration-300'>Features</Link>
            <Link to="/aboutus" className='hover:text-customeColor-400 hover:border-b-2 hover:border-customeColor-400 hover:rounded-sm hover:-translate-y-1 transition ease-in-out  duration-300'>About us</Link>
            <Link to="/contact" className='hover:text-customeColor-400 hover:border-b-2 hover:border-customeColor-400 hover:rounded-sm hover:-translate-y-1 transition ease-in-out  duration-300'>Contact us</Link>
            <Link to="/signin" className='hover:text-customeColor-400 hover:border-b-2 hover:border-customeColor-400 hover:rounded-sm hover:-translate-y-1 transition ease-in-out  duration-300'>Log in</Link>
            {/* <Link to="/signin">Sign in</Link> */}
        </nav>
    </header>
    </>)
}

export default Header;
