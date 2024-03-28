import Link from 'next/link'
import React from 'react'
import "./navbar.css"
import Image from 'next/image'
import Button from './Button'
import Dropdown from './Dropdown'

type Props = {}

function Navbar({}: Props) {

  return (
    <nav className='navbar'>
        <Link  className='box' href={"/"}>
          <Image src={"/Logo.png"} width={50} height={50} alt='Logo'/>
          <span>บริษัท เพื่อน มี จำกัด</span>
        </Link>
        <ul>
            <Link className='link' href={"/#TRENDING"}>Recommend</Link>
            <span> | </span>
            <span>
              <Dropdown/>
            </span>
        </ul>
    </nav>
  )
}

export default Navbar