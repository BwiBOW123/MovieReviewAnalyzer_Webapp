'use client'
import { useParams } from 'next/navigation';
import "./style.css";
import Card2 from '../../../../components/Card2';
import Link from 'next/link';
import React, { useState } from 'react';

async function getData(c_name: any) {
  const res = await fetch(`http://127.0.0.1:8000/search/${c_name}`, { next: { revalidate: 3000 } });
  const data = res.json();
  return data;
}


const User = () => {
  const params = useParams();
  const word = params.word.toString();
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  async function renderimage(Cat: string) {
    const data = await getData(Cat);
    const realData: [] = await data['data'];

    return await realData.map((d) => (
      <>
        <Card2 Data={d[0]} classNameCTN="container-card2" classNameC="container-image2" w={266} h={344} />
      </>
    ));
  }

  return (
    <>
    <div className='Container-Search'>
    <input className='in' type='text' value={searchQuery} onChange={handleInputChange} />
    <Link className='LinkSE' href={`/${searchQuery}`}>Search</Link>
    </div>
      <div className="container-content-sm">
        {renderimage(word)}
      </div>
    </>
  );
};

export default User;
//<div className="container-content-sm">{renderimage(id.toString())}</div>