import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Title from './Components/Title/Title'
import Home from './Components/Home/Home'
import About from './Components/About/About'
import Bookstore from './Components/Bookstore/Bookstore'
import WhatsAppButton from './Components/WhatsAppButton/WhatsAppButton'
import Title2 from './Components/Title2/Title2'
import Contact from './Components/Contact/Contact'
import Wordtitle from './Components/Wordtitle/Wordtitle'
import Footer from './Components/Footer/Footer'
import BookList from './Components/BookList/BookList'
import Title3 from './Components/Title3/Title3'
import OurPublications from './Components/OurPublications/OurPublications'


const App = () => {
  return (
    <div>
      <Navbar/>
      <div className='homerouter'><Home/></div>

      <div className='bg'>
        <div className='aboutrouter'>
          <br></br>
          <br></br>
          <br></br>
          <Title2/>
          <About/>
        </div>
        <br></br>
        <div className='shoprouter'>
        <Title subTitle='Shop' title=''/>
        <Bookstore/>
        {/* <BookList/> */}
        <br></br>
        </div>
        <WhatsAppButton/>

        <div className="ourpublicationsrouter">
        {/* <Title3 subTitle='Our' title='Publications'/> */}
        <OurPublications/>
        </div>

        <br></br>
        <br></br>

        <div className="contactrouter">
        <Wordtitle subTitle="Contact Us" title="Get In Touch" />
        <Contact/>
        </div>
        <Footer/>
        <br/>
      </div>

    </div>
  )
}

export default App
