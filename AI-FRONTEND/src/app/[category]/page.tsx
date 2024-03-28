import { useParams } from 'next/navigation';
import "./style.css";
import Card2 from '../../../components/Card2';
import React from 'react'

async function getData(c_name:string) {
    const res = await fetch(`http://127.0.0.1:8000/Category/${c_name}/10`,{next:{revalidate:3000}})
    const data = res.json()
    return data
}


type Params = {
  params:{
      category:string
  }
}
const User =  async ({params:{category}}:Params) => {
    

    async function renderimage(Cat:string) {
      const data = await getData(Cat);
      const realData:[] = await data['data']
    
          return await realData.map((d) => (
          <>  
              <Card2 Data={d[0]} classNameCTN="container-card2" classNameC="container-image2" w={266} h={344}/>
          </>
      ));
    }

  return (
    <>
    <h1>{category}</h1>
    <div className="container-content-sm">
      {renderimage(category.toString())}
    </div>
    </>)
};



export default User;