import React from 'react'
import './About.css';
import { delay, motion } from "framer-motion"

import quickhighlights from '../../assets/greyliquid.png'
import ourvision from '../../assets/OurVision.jpg'
import ourmission from '../../assets/OurMission.jpg'
import aba from '../../assets/aBa.png'
import aba1 from '../../assets/aBa1.png'
import aba2 from '../../assets/aBa2.png'
import ceo from '../../assets/ceo.png'

const About = () => {
  return (
    <>

    <br></br>

    <div className="about">

        <div className ="about-left">
         <motion.p 
        whileInView={{opacity: 1,y:0}}
        initial={{opacity:0, y:20}}
        transition={{duration:1.5}}>Aakash Book Agency was founded by Mr. A. Jayapaul in the year 2015, bringing with him over 30 years of experience in the book trade. Under his dedicated leadership and vision, Aakash Book Agency has steadily grown and established a solid reputation in the academic and professional publishing sector.</motion.p>
        </div>

        <motion.div
          whileInView={{opacity: 1,y:0}}
          initial={{opacity:0, y:0}}
          transition={{duration:2}}
        className="about-right">
        <img src={ceo} alt=" " className='about-img4'/> 
        </motion.div>
    </div>

    <div className="about">
    <motion.div
          whileInView={{opacity: 1,y:0}}
          initial={{opacity:0, y:0}}
          transition={{duration:2}}
        className="about-left">
        <img src={aba1} alt=" " className='about-img4'/> 
        </motion.div>
        
        <div className ="about-right">
        
        <motion.p 
        whileInView={{opacity: 1,y:0}}
        initial={{opacity:0, y:20}}
        transition={{duration:1.5}}>“Aakash Book Agency is a leading distributor for a large number of international publishers, supplying a wide range of print books that include textbooks, reference materials, and professional titles across diverse subject areas. We cater to the needs of libraries, colleges, and universities, ensuring timely access to high-quality academic resources.”</motion.p>
        <br></br>
         <motion.p 
        whileInView={{opacity: 1,y:0}}
        initial={{opacity:0, y:20}}
        transition={{duration:1.5}}>Our strong commitment lies in sourcing and delivering books efficiently from all the publishers we represent. We take pride in our well-established distribution network across India, supported by a reliable team and a growing base of channel partners, which include sub-distributors, booksellers, library suppliers, and retail bookstores.</motion.p>
        <motion.p 
        whileInView={{opacity: 1,y:0}}
        initial={{opacity:0, y:20}}
        transition={{duration:1.5}}>“At Aakash Book Agency, our mission is to be the preferred supplier for our customers—consistently exceeding expectations and contributing to the evolving educational and knowledge-sharing landscape.”</motion.p>
        <br></br>
        </div>
    </div>
    <br></br>


    <br></br>

    </>
  )
}

export default About
