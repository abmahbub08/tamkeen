import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const Account: React.FC = () => {
  return (
    <div className="sm:flex mt-36 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-2 sm:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
