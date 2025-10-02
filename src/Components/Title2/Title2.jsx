import React from 'react'
import './Title2.css'
import aboutus from '../../assets/bookshelves.png'

const Title2 = () => {
  return (
    <div>
      <div className='title'>
            <div className='shopnow-wrapper'>
              <img src={aboutus} alt="Shop Now" className='shopnow' />
              <div className='overlay'></div>
              <div className='shopnow-text'>About US</div>
            </div>
          </div>
      
    </div>
  )
}

export default Title2
