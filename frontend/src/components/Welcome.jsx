import React from "react";
import { useSelector } from "react-redux";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      <h1 className="title">Dashboard</h1>
      {user && (
        <div>
          Welcome Back
          <strong>{user.name}</strong>
        </div>
      )}
    </div>
  );
};

export default Welcome;
