import './Header.css'
import { Link } from 'react-router-dom';

function Header(){
    // return(<div className="header fixed-top">
    //     <div className='nav-logo'>
    //         <h1 className="logo">InventoFlow</h1>
    //     </div>
    //     <nav className="nav-class">
    //         <div className="first-nav">
    //             <ul>
    //                 <li><Link className='link-style' to="/">Home</Link></li>
    //                 <li><Link className='link-style' to="/about">AboutUs</Link></li>
    //                 <li><Link className='link-style' to="/contact">Contact</Link></li>
    //             </ul>
    //         </div>
    //         <div className='second-nav'>
    //             <ul>
    //                 <li>
    //                 <Link className='link-style' to="/signup-form">signup</Link>
    //                 </li>
    //                 <li>
    //                 <Link className='link-style' to="/user/login">login</Link>
    //                 </li>
    //             </ul>
    //         </div>
    //     </nav>
    // </div>);

    return(<>
    <header className="header">
        
        {/* <a href="#" class="logo"><img src="New Project.jpg">InventoFlow</a> */}
        {/* <Link to="/" className='logo'><img src={require('./img/New Project.jpg')}/>InventoFlow</Link> */}
        <Link to='/'><img className='w-40' src={require('./img/logo-white-transparent.png')}/></Link>

        <nav class="navbar">
            <Link to="/">Home</Link>
            <Link to="/signup">Sign up</Link>
            <Link to="/signin">Sign in</Link>
            <Link to="/aboutus">About us</Link>
            <Link to="/contact">Contact us</Link>
        </nav>
    </header>
    </>)
}

export default Header;