import React from "react";

// Define the types for the props
interface PricingTableProps {
  level_name: string;
  levelColor: string;
  monthly_fee: number;
  p1: number;
  p2: number;
  p3: number;
}

const PricingTable: React.FC<PricingTableProps> = ({ level_name, levelColor, monthly_fee, p1, p2, p3 }) => {
  
  // Calculate the dynamic values based on the passed props
  const percentage1 = p1 / 100;
  const percentage2 = p2 / 100;
  const percentage3 = p3 / 100;
  
  // Calculate the dynamic price based on percentages
  const price1 = monthly_fee * percentage1;
  const price2 = monthly_fee * percentage2;
  const price3 = monthly_fee * percentage3;

  // Total price calculation (just an example)
  const totalPrice = monthly_fee + price1 + price2 + price3;

  return (
    <div className="overflow-x-auto">
      <table className="table w-full border-collapse border border-gray-300">
        <thead>
          <tr className={`hover border-b border-gray-300 ${levelColor}`}>
            <th className="text-start p-2 border-r border-gray-300" colSpan={27}>
              {level_name}
            </th>
            <th className="p-2 border-r border-gray-300">&nbsp;</th>
            <th className="text-start p-2">${monthly_fee.toFixed(2)}</th>
          </tr>
        </thead>
        <tbody>
          <tr className={`hover border-b border-gray-300`}>
            <td colSpan={27} className="p-2 border-r border-gray-300"></td>
            <td className="text-start p-2 border-r border-gray-300">%</td>
            <td className="text-start p-2">$</td>
          </tr>
          <tr className={`hover border-b border-gray-300 ${levelColor}`}>
            <td colSpan={9} className="p-2 border-r border-gray-300">1</td>
            <td colSpan={9} className="p-2 border-r border-gray-300">2</td>
            <td colSpan={9} className="p-2 border-r border-gray-300">3</td>
            <td className="text-start p-2 border-r border-gray-300">{p1}%</td>
            <td className="text-start p-2">${price1.toFixed(2)}</td>
          </tr>
          <tr className={`hover border-b border-gray-300`}>
            <td colSpan={3} className="p-2 border-r border-gray-300">1</td>
            <td colSpan={3} className="p-2 border-r border-gray-300">2</td>
            <td colSpan={3} className="p-2 border-r border-gray-300">3</td>
            <td colSpan={3} className="p-2 border-r border-gray-300">1</td>
            <td colSpan={3} className="p-2 border-r border-gray-300">2</td>
            <td colSpan={3} className="p-2 border-r border-gray-300">3</td>
            <td colSpan={3} className="p-2 border-r border-gray-300">1</td>
            <td colSpan={3} className="p-2 border-r border-gray-300">2</td>
            <td colSpan={3} className="p-2 border-r border-gray-300">3</td>
            <td className="text-start p-2 border-r border-gray-300">{p2}%</td>
            <td className="text-start p-2">${price2}</td>
          </tr>
          <tr className={`hover border-b border-gray-300 ${levelColor}`}>
            {Array.from({ length: 27 }, (_, i) => (
              <td key={i} className="text-start p-2 border-r border-gray-300">
                {(i % 3) + 1}
              </td>
            ))}
            <td className="text-start p-2 border-r border-gray-300">{p3}%</td>
            <td className="text-start p-2">${price3.toFixed(2)}</td>
          </tr>
          <tr className={`hover border-b border-gray-300`}>
            <td colSpan={27} className="p-2 border-r border-gray-300">
              &nbsp;
            </td>
            <td className="text-start p-2">${totalPrice.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
