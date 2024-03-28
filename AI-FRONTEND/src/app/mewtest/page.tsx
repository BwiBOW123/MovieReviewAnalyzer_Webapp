import React from 'react'
import Button from '../../../components/Button'
import Tagbar from '../../../components/Tagbar'
import TagIcon2 from '../../../components/TagIcon2'
import TagIcon from '../../../components/TagIcon'
import ShowImage from '../../../components/ShowImage'
import Footer from '../../../components/Footer'
import FooterButton from '../../../components/FooterButton'

type Props = {}

function page({}: Props) {
  return (
    <>
      <button className='btnNext'><span></span></button>

      <button className='btnViewAll'><span>View all</span></button>

      <Button className='btnSignInHome'>SIGN IN</Button>

      <Button className='btnSignIn'>SIGN IN</Button>

      <Button className='btnLogin'>LOG IN</Button>

      <Button className='btnAdd1'>+ Add to Favourite</Button>

      <button className='btnAdd2'><span>Add to Favourite</span></button>

      <Tagbar className='tagHD'>HD</Tagbar>

      <Tagbar className='tagSeason'>Season 1</Tagbar>

      <Tagbar className='tagCategory'>Action</Tagbar>

      <TagIcon image='/star.png' className='tagRating' w={15} h={15} marginL={5}>8.5</TagIcon>

      <TagIcon image='/calendar.png' className='tagDate' w={20} h={15} marginL={5}>2022</TagIcon>

      <TagIcon image='/time.png' className='tagRating' w={20} h={15} marginL={5}>2:10:00</TagIcon>


      <Tagbar className='tagTime'>2:10:00</Tagbar>

      <ShowImage image='/bad.png' w={30} h={0}></ShowImage>

      <ShowImage image='/good.png' w={30} h={0}></ShowImage>


      <Footer
      image='/logo.png'  w={50} h={0} 
      partName1='part1-1'detialPart1='website or application service that helps you choose or recommend places that are nicknamed hidden gems to make them more well-known and crowded  
      Read more...'
      partName2='part1-2' detialPart2='simply dummy text of the printing and typesetting industry.'
      partName3='part1-3' detialPart3='+000 00000 000'></Footer>

      <FooterButton 
      partName1='part1'detialPart1='Destinations'
      partName2='part2' detialPart2='Sam Phan Bok'
      partName3='part3' detialPart3='Old Phuket Town'></FooterButton>

      <FooterButton 
      partName1='part1'detialPart1='Get to know Us'
      partName2='part2' detialPart2='About Company'
      partName3='part3' detialPart3='Call To Kindness'
      partName4='part4' detialPart4='Help & Support'></FooterButton>
      
      <FooterButton 
      partName1='part1'detialPart1='Policies'
      partName2='part2' detialPart2='Shopping Policy'
      partName3='part3' detialPart3='Refund & Cancellation'
      partName4='part4' detialPart4='Privacy Policy'></FooterButton>

      <FooterButton 
      partName1='part1'detialPart1='Customer Support'
      partName2='part2' detialPart2='Email : nfo@ecample.com'
      partName3='part3' detialPart3='Phone : +66 0000 1111 2222'></FooterButton>
    </>
  )
}

export default page