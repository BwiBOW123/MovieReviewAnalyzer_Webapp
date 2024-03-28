import React from 'react'
import './dropdown.css'
import Link from 'next/link'
import Image from 'next/image'

type Props = {}

const Dropdown = (props: Props) => {

  return (
    <div className='dropdown activeDrop '>
        <span className='link '>Category  𐊼</span>
        <div className='dropdown-list'>
            <ul className='droptext'>
                <Link className='link' href={'/Thriller'}>Thriller</Link>
                <Link className='link' href={'/Adventure'}>Adventure</Link>
                <Link className='link' href={'/Comedy'}>Comedy</Link>
                <Link className='link' href={'/Crime'}>Crime</Link>
                <Link className='link' href={'/Horror'}>Horror</Link>
                <Link className='link' href={'/Drama'}>Drama</Link>
                <Link className='link' href={'/Action'}>Action</Link>
                <Link className='link' href={'/Mystery'}>Mystery</Link>
                <Link className='link' href={'/Science Fiction'}>Sci Fi</Link>
                <Link className='link' href={'/Allmovie'}>All Movie</Link>

            </ul>
        </div>
    </div>
  )
}

export default Dropdown