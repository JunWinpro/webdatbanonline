import React, { useEffect, useState } from 'react';

const FixedComponent = () => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const triggerPosition = 100;

      if (scrollPosition > triggerPosition) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);


    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      style={{
        position: isFixed ? 'fixed' : 'static',
        top: isFixed ? 0 : 'auto',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: '10px',
        boxShadow: isFixed ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <h2>Đây là component cố định</h2>
      <p>Nội dung của component sẽ được cố định khi scroll đến vị trí nhất định.</p>
    </div>
  );
};

export default FixedComponent;