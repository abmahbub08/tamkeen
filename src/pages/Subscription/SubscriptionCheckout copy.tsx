import React, { useState } from "react";

type Plan = {
    id: number;
    level_name: string;
    monthly_fee: number;
    description: string;
    discount: number; // Discount applied from referral or coupon
};

const FAQs = [
    {
        question: "What is a Pyramid Selling System?",
        answer:
            "In a pyramid selling system, participants earn commissions not only from their sales but also from the sales of people they recruit into the system.",
    },
    {
        question: "How does referral profit distribution work?",
        answer:
            "Referral profits are distributed in levels. For example, you may earn 10% from Level 1 referrals, 5% from Level 2, and 2% from Level 3.",
    },
    {
        question: "Can I earn without recruiting new members?",
        answer:
            "Yes, you can earn through the sales of your direct referrals or by actively participating in the system.",
    },
    {
        question: "What happens if a referrer is inactive?",
        answer:
            "If a referrer is inactive, the profit-sharing system ensures active participants still receive their rightful share.",
    },
    {
        question: "Can I cancel my subscription?",
        answer:
            "Yes, you can cancel your subscription at any time. Benefits and referral commissions stop after cancellation.",
    },
];

const SubscriptionCheckoutPage = () => {
    const [selectedPlan] = useState<Plan>({
        id: 1,
        level_name: "Gold Plan",
        monthly_fee: 150.0,
        description: "A comprehensive investment strategy designed for maximum returns.",
        discount: 0.0,
    });

    const [referralCode, setReferralCode] = useState<string>("");
    const [referralMessage, setReferralMessage] = useState<string | null>(null);
    const [referrerInfo, setReferrerInfo] = useState<any | null>(null);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [expandedFAQIndex, setExpandedFAQIndex] = useState<number | null>(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");


    const [loading, setLoading] = useState<boolean>(false); // Add this at the top with other state variables

    const handleReferralCode = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`https://api.tamkeen.center/api/apply-referral-code/64`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ referral_code: referralCode }),
            });

            const data = await response.json();

            if (response.ok) {
                setReferrerInfo(data.referrer); // Save referrer info to display
                setToastMessage("Referral code applied successfully!");
                setToastType("success");
            } else {
                setReferrerInfo(null);
                setToastMessage(data.message || "Invalid referral code.");
                setToastType("error");
            }
        } catch (error) {
            console.error("Error applying referral code:", error);
            setToastMessage("Something went wrong. Please try again later.");
            setToastType("error");
            setReferrerInfo(null);
        } finally {
            setLoading(false); // Stop loading
            setShowToast(true); // Show toast
            setTimeout(() => setShowToast(false), 3000); // Auto-hide after 3 seconds
        }
    };


    const handleSubscribe = () => {
        if (!termsAccepted) {
            setToastMessage("Please accept the terms and conditions to proceed.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        setToastMessage("Subscription successful! Thank you for choosing us.");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };
    

    const totalPrice = selectedPlan.monthly_fee - selectedPlan.discount;

    return (
        <div className="w-full min-h-screen mt-20 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 md:px-16 py-8">
                {/* Left Section */}
                <div className="col-span-2 bg-white rounded-lg p-6 shadow-md">
                    <h1 className="text-3xl font-bold mb-8 text-blue-700">
                        Subscription Checkout
                    </h1>

                    {/* Plan Summary */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Your Selected Plan</h2>
                        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                            <p className="text-xl font-bold text-gray-800 mb-2">{selectedPlan.level_name}</p>
                            <p className="text-gray-600 mb-4">{selectedPlan.description}</p>
                            <p className="text-lg text-gray-800 font-semibold">
                                Monthly Fee: ${selectedPlan.monthly_fee.toFixed(2)}
                            </p>
                        </div>
                    </section>

                    {/* Referral Code Section */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Referral Code</h2>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Enter referral code"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleReferralCode}
                                disabled={loading}
                                className={`px-6 py-2 rounded-md text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {loading ? "Applying..." : "Apply"}
                            </button>
                        </div>
                        {referralMessage && (
                            <p
                                className={`mt-2 ${referralMessage.includes("successfully") ? "text-green-500" : "text-red-500"
                                    }`}
                            >
                                {referralMessage}
                            </p>
                        )}
                        {referrerInfo && (
                            <div className="mt-6 p-6 bg-white border border-gray-300 rounded-md shadow-md">
                                <h3 className="text-xl font-semibold text-blue-700 mb-4">Referrer Details</h3>
                                <div className="flex flex-col items-start">
                                    <p className="text-gray-600">
                                        <span className="font-bold text-gray-800">Name:</span> {referrerInfo.name}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-bold text-gray-800">Referral Code:</span>{" "}
                                        {referrerInfo.referral_code}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-bold text-gray-800">Email:</span> {referrerInfo.email}
                                    </p>
                                </div>
                                <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                                    <h4 className="text-lg font-semibold text-blue-600">Total Profit Earned</h4>
                                    <p className="text-2xl font-bold text-blue-800">
                                        ${referrerInfo.total_profit || "0.00"}
                                    </p>
                                </div>
                            </div>
                        )}

                    </section>


                    {/* Cost Breakdown */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Cost Breakdown</h2>
                        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                            <div className="flex justify-between mb-2">
                                <p>Base Price:</p>
                                <p>${selectedPlan.monthly_fee.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between mb-2">
                                <p>Discount:</p>
                                <p className="text-red-600">-${selectedPlan.discount.toFixed(2)}</p>
                            </div>
                            <div className="border-t border-gray-300 my-2"></div>
                            <div className="flex justify-between font-bold">
                                <p>Total Price:</p>
                                <p>${totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="payment-method"
                                    value="cash"
                                    checked
                                    readOnly
                                    className="mr-3"
                                />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                    </section>

                    {/* Terms and Conditions */}
                    <section className="mb-8">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={() => setTermsAccepted(!termsAccepted)}
                                className="mr-3"
                            />
                            <span>
                                I agree to the{" "}
                                <a href="/terms" className="text-blue-500">
                                    terms and conditions
                                </a>.
                            </span>
                        </label>
                    </section>

                    {/* Subscribe Button */}
                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700"
                    >
                        Subscribe Now
                    </button>
                </div>

                {/* Right Section - FAQ */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-3xl font-bold mb-6 text-blue-700">FAQs</h2>
                    <div className="space-y-4">
                        {FAQs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-300 rounded-md p-4 bg-gray-50"
                            >
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() =>
                                        setExpandedFAQIndex(expandedFAQIndex === index ? null : index)
                                    }
                                >
                                    <p className="font-semibold text-gray-800">{faq.question}</p>
                                    <span className="text-gray-600">
                                        {expandedFAQIndex === index ? "-" : "+"}
                                    </span>
                                </div>
                                {expandedFAQIndex === index && (
                                    <p className="text-gray-600 mt-2">{faq.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showToast && (
                <div className="toast toast-bottom toast-center z-50">
                    <div className={`alert ${toastType === "success" ? "alert-success" : "alert-error"} text-white`}>
                        <div>
                            <span>{toastMessage}</span>
                        </div>
                        <div
                            className="cursor-pointer"
                            onClick={() => setShowToast(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

        </div>



    );
};

export default SubscriptionCheckoutPage;
