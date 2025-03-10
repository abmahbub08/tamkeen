import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isManageAccountOpen, setIsManageAccountOpen] = useState(true);

  const menuItems = [
    {
      title: "Manage My Account",
      subItems: [
        { name: "My Profile", path: "/account" },
        { name: "Address Book", path: "/account/address-book" },
        { name: "My Payment Options", path: "/account/payment-options" },
      ],
    },
    { name: "My Orders", path: "/account/orders" },
    { name: "My Wishlist", path: "/account/wishlist" },
    { name: "My Discount", path: "/account/discount" },
    { name: "Refer a Friend", path: "/account/refer-a-friend" },
  ];

  const toggleManageAccount = () => {
    setIsManageAccountOpen(!isManageAccountOpen);
  };

  return (
    <div className="w-64 h-full p-6 bg-white">
      <h2 className="text-xl font-bold mb-6">Account</h2>
      <ul className="space-y-4">
        {menuItems.map((item, index) => {
          if (item.subItems) {
            return (
              <li key={index}>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={toggleManageAccount}
                >
                  <span className="font-semibold hover:text-primary">{item.title}</span>
                </div>
                {isManageAccountOpen && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subItem.path}
                          className="hover:text-primary"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          } else {
            return (
              <li key={index}>
                <Link to={item.path} className="hover:text-primary font-semibold">
                  {item.name}
                </Link>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
