import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';



const bannerList = [
  { 
    imageUrl: 'https://pastaxi-manager.onepas.vn/Upload/DoiTuong/Avatar/638436373819495713-638411018904233944-nha-hang-thai-lan.png?Width=600&Type=webp',
    title: 'Nhà hàng MÓN THÁI siêu ngon! Đậm đà hương vị Thái',
    description: 'Các món Thái chua chua cay cay thổi bùng vị giác. Gồm các quán buffet Thái Lan và gọi món Thái Lan,',
    link: '/sda'
  },

];

const Banner = () => {
  return (
    <div>
      {bannerList.map((banner, index) => (
        <div key={index} className="w-full flex justify-center my-20">
          <div className="flex p-5 rounded-lg bg-yellow-400 w-8/12">
            <img src={banner.imageUrl} className="rounded-2xl w-3/5" alt={`Banner ${index}`} />
            <div className="block p-7">
              <p className="text-4xl font-semibold">{banner.title}</p>
              <br />
              <p className="text-lg font-normal">{banner.description}</p>
              <Button className="mt-4 text-lg w-36 h-12 rounded-3xl font-semibold">
                <Link to={banner.link}>Xem ngay</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;