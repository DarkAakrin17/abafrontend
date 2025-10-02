import React from 'react'
import './Title3.css'
import shopnow from '../../assets/shopnow.png'

const Title3 = ({ subTitle, title }) => {
  return (
    <div className='title'>

      <div className='shopnow-wrapper'>
        <img src={shopnow} alt="Shop Now" className='shopnow' />
        <div className='overlay'></div>
        <div className='shopnow-text'>Our Publications</div>
      </div>
    </div>
  )
}

export default Title3
