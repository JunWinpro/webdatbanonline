import React from "react";

const TitleBar = ({ title, description }) => {
  return (
    <div className="w-3/4 mx-20">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default TitleBar;