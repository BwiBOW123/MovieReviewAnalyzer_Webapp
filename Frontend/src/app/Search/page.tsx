"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import './style.css';

type Props = {};

const Page = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className='Container-Search'>
        <input className='in' type='text' value={searchQuery} onChange={handleInputChange} />
        <Link className='LinkSE' href={`/Search/${searchQuery}`}>
          Search
        </Link>
      </div>
    </>
  );
};

export default Page;
