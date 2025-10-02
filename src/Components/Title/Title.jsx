import React from 'react'
import './Title.css'
import shopnow from '../../assets/shopnow.png'

const Title = ({ subTitle, title }) => {
  return (
    <div className='title'>

      <div className='shopnow-wrapper'>
        <img src={shopnow} alt="Shop Now" className='shopnow' />
        <div className='overlay'></div>
        <div className='shopnow-text'>Shop Now</div>
      </div>
    </div>
  )
}

export default Title
