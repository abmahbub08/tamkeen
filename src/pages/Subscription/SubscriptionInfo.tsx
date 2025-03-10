import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const SubscriptionInfoPage = () => {
    const { membership_id } = useParams<{ membership_id: string }>();
    const [subscriptionInfo, setSubscriptionInfo] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSubscriptionInfo = async () => {
            try {
                const response = await fetch(`https://api.tamkeen.center/api/pyramid/view-membership-info/${membership_id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("token")}`, // Include token if required
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setSubscriptionInfo(data);
                } else {
                    console.error("Failed to fetch subscription info:", data.message);
                }
            } catch (error) {
                console.error("Error fetching subscription info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptionInfo();
    }, [membership_id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    if (!subscriptionInfo) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">Failed to load subscription information. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen mt-20 bg-gray-100">
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-blue-700">Subscription Information</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Membership Details</h2>
                    <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                        <p className="text-xl font-bold text-gray-800 mb-2">{subscriptionInfo.level_name}</p>
                        <p className="text-gray-600 mb-4">{subscriptionInfo.description}</p>
                        <p className="text-lg text-gray-800 font-semibold">
                            Monthly Fee: ${subscriptionInfo.monthly_fee.toFixed(2)}
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Referral Details</h2>
                    <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                        <p className="text-gray-800">
                            <span className="font-bold">Total Referrals:</span> {subscriptionInfo.total_referrals}
                        </p>
                        <p className="text-gray-800">
                            <span className="font-bold">Total Profit:</span> ${subscriptionInfo.total_profit || "0.00"}
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Referral Levels</h2>
                    {subscriptionInfo.referral_tree && subscriptionInfo.referral_tree.length > 0 ? (
                        subscriptionInfo.referral_tree.map((level: any, index: number) => (
                            <div key={index} className="mb-4">
                                <h3 className="text-lg font-semibold">Level {level.level}</h3>
                                <p>Total Profit: ${level.total_profit || "0.00"}</p>
                                <p>Total Referrals: {level.referrals_count}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No referrals yet.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default SubscriptionInfoPage;
