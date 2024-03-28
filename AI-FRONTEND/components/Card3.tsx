import Image from "next/image"
import "./card.css"
import React from 'react'
import Link from "next/link"
import Tagbar from "./Tagbar"


type Props = {
    link?:string,
    classNameCTN?:string,
    classNameC?:string,
    classNameTag?:string,
    w?:number,
    h?:number,
    image:string;
}

const Card = ({classNameCTN,classNameC,classNameTag="",w = 350,h = 350,image,link="/"}:Props) => {
  return (
    <Link className="" href={link}>
        <div className={classNameCTN}>
            <div className={classNameC}>
            <Image className="image" src={image} width={w} height={h} alt="Image in Card"/>
            </div>
        </div>
    </Link>
  )
}

export default Card