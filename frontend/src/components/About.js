import Headers from "./Header";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
  } from "@material-tailwind/react";
  import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
function About(){
    return(<div className="h-screen w-screen">
        <Headers/>
        <div className="flex flex-row items-center justify-items-center content-center justify-center">
            <Card className="w-96 justify-self-center self-center mt-36 bg-gradient-to-r from-customeColor-400 to-customeColor-200">
                <CardHeader floated={false} className="h-80">
                    <img src={require('./img/myImg.jpeg')} alt="profile-picture" className=""/>
                </CardHeader>
                <CardBody className="text-center">
                    <Typography variant="h4" color="blue-gray" className="mb-2">
                        Mohammad Kaif
                    </Typography>
                    <Typography color="blue-gray" className="font-medium" textGradient>
                        CEO / Co-Founder
                    </Typography>
                    <Typography>
                        B.Tech IT From DDU Nadiad
                    </Typography>
                </CardBody>
                <CardFooter className="flex justify-center gap-7 pt-2 mb-2">
                    <FaInstagram size={25} className="text-black cursor-pointer" onClick={()=>{window.location.href='https://www.instagram.com/saiyad.m.kaif/'}} />
                    <FaLinkedin size={25} className="text-black cursor-pointer" onClick={()=>{window.location.href='https://www.linkedin.com/in/mohammad-kaif-saiyad'}} />
                    <FaGithub size={25} className="text-black cursor-pointer "onClick={()=>{window.location.href='https://github.com/MohammadKaifSaiyad/'}} />
                </CardFooter>
            </Card>
            
        </div>
    </div>);
}

export default About;