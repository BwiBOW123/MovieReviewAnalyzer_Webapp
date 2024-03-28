import React, { useEffect, useState } from 'react';
import './Comment.css';

interface CommentListProps {
  comments: string[];
  timeAt: string[];
}

const CommentList: React.FC<CommentListProps> = ({ comments, timeAt }) => {
  const [timeDifferences, setTimeDifferences] = useState<string[]>([]);

  useEffect(() => {
    const calculateTimeDifferences = () => {
      const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });

      const differences = timeAt.map((createdAtDate) => {
        const commentDate = new Date(createdAtDate);
        const secondsDiff = Math.floor((new Date(now).getTime() - commentDate.getTime()) / 1000);

        if (secondsDiff < 60) {
          return 'moments ago';
        } else if (secondsDiff < 3600) {
          const minutes = Math.floor(secondsDiff / 60);
          return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (secondsDiff < 86400) {
          const hours = Math.floor(secondsDiff / 3600);
          const remainingMinutes = Math.floor((secondsDiff % 3600) / 60);
        
          if (remainingMinutes === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
          } else {
            return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} ago`;
          }
        } else if (secondsDiff < 604800) {
          const days = Math.floor(secondsDiff / 86400);
          return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
          const weeks = Math.floor(secondsDiff / 604800);
          const remainingDays = Math.floor((secondsDiff % 604800) / 86400);
        
          if (remainingDays === 0) {
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
          } else {
            return `${weeks} week${weeks > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''} ago`;
          }
        }
      });

      setTimeDifferences(differences);
    };

    const interval = setInterval(calculateTimeDifferences, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [timeAt]);

  return (
    <div>
      <div className='Comlist'>
        {comments.map((comment, index) => (
          <>
          <div className='List' key={index}>
       
            <p className='text'>{comment}</p>
          </div>
          </>  
        ))}
      </div>
    </div>
  );
};

export default CommentList;
