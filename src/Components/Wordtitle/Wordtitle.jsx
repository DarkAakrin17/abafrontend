import React from 'react'
import './Wordtitle.css'

const Wordtitle = ({ subTitle, title }) => {
  return (
    <div className='wordtitle'>
      <p className='wordsubtitle'>{subTitle}</p>
      <h2>{title}</h2>
    </div>
  )
}

export default Wordtitle
