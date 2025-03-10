import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

type Referral = {
    id: number;
    referrer_id: number;
    user_id: number;
    membership_level_id: number;
    profit: string;
    level: number;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        referral_code: string;
    };
    membership_level: {
        id: number;
        level_name: string;
        monthly_fee: number;
        description: string;
        percentage_in_level_1: number;
        percentage_in_level_2: number;
        percentage_in_level_3: number;
    } | null;
};

type Level = {
    level: number;
    referrals_count: number;
    total_profit: string;
    referrals: Referral[];
};

const ReferralTreePage = () => {
    const { userId } = useParams<{ userId: string }>();

    const [referralTree, setReferralTree] = useState<Level[] | null>(null);
    const [userDetails, setUserDetails] = useState<{ name: string; referral_code: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedReferral, setExpandedReferral] = useState<number | null>(null); // Track expanded referral

    useEffect(() => {
        const fetchReferralTree = async () => {
            try {
                const currentUser = Cookies.get("user");
                const mydata = JSON.parse(currentUser!);
                
                const response = await fetch(`https://api.tamkeen.center/api/pyramid/referral-tree/${mydata.id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setReferralTree(data.referral_tree);
                    setUserDetails({ name: data.user.name, referral_code: data.user.referral_code });
                } else {
                    setError(data.message || "Failed to fetch referral tree.");
                }
            } catch (err) {
                setError("An error occurred while fetching the referral tree.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReferralTree();
    }, [userId]);

    const toggleReferral = (id: number) => {
        setExpandedReferral(expandedReferral === id ? null : id);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 ">
            <div className="max-w-5xl mt-24 mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-blue-700">Referral Tree</h1>

                {/* User Referral Code Section */}
                {userDetails && (
                    <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg shadow-md mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-700">Your Referral Code</h2>
                            <p className="text-lg text-gray-700 mt-1">{userDetails.referral_code}</p>
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            onClick={() => navigator.clipboard.writeText(userDetails.referral_code)}
                        >
                            Copy Code
                        </button>
                    </div>
                )}

                {referralTree && referralTree.length > 0 ? (
                    referralTree.map((level, index) => (
                        <div key={index} className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Level {level.level}</h2>
                            <p className="text-gray-800 mb-2">
                                <span className="font-bold">Total Referrals:</span> {level.referrals_count}
                            </p>
                            <p className="text-gray-800 mb-4">
                                <span className="font-bold">Total Profit:</span> ${level.total_profit}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {level.referrals.map((referral) => (
                                    <div key={referral.id} className="p-6 bg-gray-50 border rounded-md shadow-md">
                                        <h3 className="font-semibold text-lg text-blue-600 mb-2">
                                            {referral.user.name}
                                        </h3>
                                        <div className="text-gray-600 space-y-2">
                                            <p>
                                                <span className="font-bold">Email:</span> {referral.user.email}
                                            </p>
                                            <p>
                                                <span className="font-bold">Phone:</span> {referral.user.phone}
                                            </p>
                                            <p>
                                                <span className="font-bold">Referral Code:</span>{" "}
                                                {referral.user.referral_code}
                                            </p>
                                            <p>
                                                <span className="font-bold">Profit:</span> ${referral.profit}
                                            </p>
                                        </div>

                                        {referral.membership_level && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => toggleReferral(referral.id)}
                                                    className="w-full text-left bg-blue-100 p-2 rounded-md hover:bg-blue-200"
                                                >
                                                    <span className="font-bold text-blue-600">
                                                        {expandedReferral === referral.id
                                                            ? "Hide Membership Details"
                                                            : "Show Membership Details"}
                                                    </span>
                                                </button>
                                                {expandedReferral === referral.id && (
                                                    <div className="mt-2 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                                                        <h4 className="font-semibold text-blue-600">
                                                            Membership Level: {referral.membership_level.level_name}
                                                        </h4>
                                                        <p className="text-gray-600">
                                                            <span className="font-bold">Monthly Fee:</span> $
                                                            {referral.membership_level.monthly_fee.toFixed(2)}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            <span className="font-bold">Description:</span>{" "}
                                                            {referral.membership_level.description}
                                                        </p>
                                                        <div className="text-gray-600">
                                                            <span className="font-bold">Profit Percentages:</span>
                                                            <ul className="list-disc pl-5">
                                                                <li>
                                                                    Level 1:{" "}
                                                                    {referral.membership_level.percentage_in_level_1}%
                                                                </li>
                                                                <li>
                                                                    Level 2:{" "}
                                                                    {referral.membership_level.percentage_in_level_2}%
                                                                </li>
                                                                <li>
                                                                    Level 3:{" "}
                                                                    {referral.membership_level.percentage_in_level_3}%
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No referrals found.</p>
                )}
            </div>
        </div>
    );
};

export default ReferralTreePage;
