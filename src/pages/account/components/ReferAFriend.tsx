import React from "react";
import { ReferralWidget } from "../../../components/ReferralWidget";

const ReferAFriend: React.FC = () => {
   const cards = [
      { title: "Friends Invited", value: 0 },
      { title: "Friends Referred", value: 0 },
      { title: "Credits Earned", value: 0, unit: "$" },
      { title: "Pending Credits", value: 0, unit: "$" },
      { title: "Pending Invites (0)", value: "No pending invites at the moment.", colSpan: 2 },
    ];
  return (
    <div className="sm:flex">
    <div className=" w-full mx-auto p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Refer a Friend Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${card.colSpan ? `md:col-span-${card.colSpan}` : ""}`}
          >
            <h3 className="text-lg font-bold">{card.title}</h3>
            <div className="divider"></div>
            <p className="text-2xl font-bold mt-2">
              {typeof card.value === "number" ? `${card.unit || ""} ${card.value}` : card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
      <ReferralWidget />
    </div>
  );
};

export default ReferAFriend;
