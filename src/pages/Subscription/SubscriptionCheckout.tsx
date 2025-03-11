import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../chat/firebase";
import { Chat } from "../chat/types";
import { useAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";

type Plan = {
    id: number;
    level_name: string;
    monthly_fee: number;
    description: string;
    discount: number;
    color?: string; // Optional for styling based on level
};

const FAQs = [
    {
        question: "What is a Pyramid Selling System?",
        answer:
            "In a pyramid selling system, participants earn commissions not only from their sales but also from the sales of people they recruit into the system. This allows you to build a passive income stream over time."
    },
    {
        question: "How does referral profit distribution work?",
        answer:
            "Referral profits are distributed in levels. For example, you may earn 10% from Level 1 referrals, 5% from Level 2, and 2% from Level 3. The more active your network, the higher your earnings."
    },
    {
        question: "Can I earn without recruiting new members?",
        answer:
            "Yes! You can earn through the sales of your direct referrals or by actively participating in the system. Unlike traditional pyramid schemes, our system rewards active contributors fairly."
    },
    {
        question: "What happens if a referrer is inactive?",
        answer:
            "If a referrer is inactive, the profit-sharing system ensures active participants still receive their rightful share. You are not affected by inactive members in your network."
    },
    {
        question: "Can I cancel my subscription?",
        answer:
            "Yes, you can cancel your subscription at any time. However, access to exclusive benefits and referral commissions will stop after cancellation."
    },
    {
        question: "Is this system secure and trustworthy?",
        answer:
            "Absolutely! We use secure payment methods, transparent profit distribution, and compliance with financial regulations to ensure a safe and reliable experience."
    },
    {
        question: "How quickly can I start earning?",
        answer:
            "Earnings depend on your activity and network growth. Many users start seeing results within their first month by referring friends and utilizing our platform effectively."
    },
    {
        question: "Is there a limit to how much I can earn?",
        answer:
            "No! Your earnings potential is unlimited. The more referrals and sales you generate, the more you can earn. It’s all about how actively you engage with the system."
    },
    {
        question: "What makes this subscription different from others?",
        answer:
            "Unlike traditional MLM models, we prioritize fair profit-sharing, active user incentives, and long-term sustainability. Our system is designed to benefit both new and existing users equally."
    },
    {
        question: "What support is available for new users?",
        answer:
            "We provide 24/7 customer support, comprehensive training materials, and community support to help you succeed from day one."
    },
    {
        question: "Do I need technical skills to participate?",
        answer:
            "Not at all! Our system is designed for beginners and experts alike. If you can share a referral link and follow simple steps, you can start earning."
    },
    {
        question: "Are there any hidden charges?",
        answer:
            "No, there are no hidden fees. Everything is transparent, and you only pay the subscription fee based on your selected plan."
    },
    {
        question: "What are the benefits of subscribing early?",
        answer:
            "Early subscribers get exclusive benefits like priority placement, bonus commissions, and access to limited-time promotions!"
    },
    {
        question: "Can I upgrade my subscription level later?",
        answer:
            "Yes! You can upgrade your subscription at any time to access higher commission rates and premium benefits."
    },
];

// Skeleton component for loading state
const SkeletonLoader = () => (
    <div className="space-y-8">
        {/* Skeleton for Plan Summary */}
        <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Skeleton for Referral Code Section */}
        <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="flex items-center gap-4">
                <div className="h-10 bg-gray-300 rounded w-2/3"></div>
                <div className="h-10 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mt-4"></div>
        </div>

        {/* Skeleton for Referrer Info */}
        <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Skeleton for Cost Breakdown */}
        <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>

        {/* Skeleton for Payment Method */}
        <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="flex items-center gap-4">
                <div className="h-10 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>

        {/* Skeleton for Terms and Conditions */}
        <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Skeleton for Subscribe Button */}
        <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-full mb-6"></div>
        </div>
    </div>
);

const SubscriptionCheckoutPage = () => {
    const { membership_id } = useParams<{ membership_id: string }>();
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
    const [referralCode, setReferralCode] = useState<string>("");
    const [referralMessage, setReferralMessage] = useState<string | null>(null);
    const [referrerInfo, setReferrerInfo] = useState<any | null>(null);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [expandedFAQIndex, setExpandedFAQIndex] = useState<number | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [loading, setLoading] = useState<boolean>(false);
    const [auth] = useAtom(authAtom);
    const [isReferralValid, setIsReferralValid] = useState<boolean>(false);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlanDetails = async () => {
            try {
                const response = await fetch(`https://api.tamkeen.center/api/membership-levels/${membership_id}`);
                const data = await response.json();
                if (response.ok) {
                    setSelectedPlan({
                        id: data.id,
                        level_name: data.level_name,
                        monthly_fee: data.monthly_fee,
                        description: data.description,
                        discount: 0,
                        color: data.color,
                    });
                } else {
                    console.error("Failed to fetch plan details");
                }
            } catch (error) {
                console.error("Error fetching plan details:", error);
            } finally {
                setIsLoading(false); // Stop loading state
            }
        };

        fetchPlanDetails();
    }, [membership_id]);

    const handleReferralCode = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.tamkeen.center/api/apply-referral-code/${membership_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ referral_code: referralCode }),
            });

            const data = await response.json();

            if (response.ok) {
                setReferrerInfo(data.referrer);
                setToastMessage("Referral code applied successfully!");
                setToastType("success");
                setIsReferralValid(true);
            } else {
                setReferrerInfo(null);
                setToastMessage(data.message || "Invalid referral code.");
                setToastType("error");
                setIsReferralValid(false);
            }
        } catch (error) {
            console.error("Error applying referral code:", error);
            setToastMessage("Something went wrong. Please try again later.");
            setToastType("error");
            setIsReferralValid(false);
        } finally {
            setLoading(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleSubscribe = async () => {
        if (!termsAccepted) {
            setToastMessage("Please accept the terms and conditions to proceed.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        setLoading(true);
        try {
            const token = Cookies.get("token");

            const response = await fetch(`https://api.tamkeen.center/api/pyramid/subscribe/${membership_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include auth token if needed
                },
                body: JSON.stringify({
                    referrer_id: referrerInfo?.id || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setToastMessage("Subscription successful! Thank you for choosing us.");
                setToastType("success");
                setShowToast(true);

                // Navigate to home page after 3 seconds
                setTimeout(() => {
                    navigate(`/subscription-info/${membership_id}`);
                }, 1000);
            } else {
                setToastMessage(data.message || "Subscription failed. Please try again.");
                setToastType("error");
            }
        } catch (error) {
            console.error("Error during subscription:", error);
            setToastMessage("An error occurred. Please try again later.");
            setToastType("error");
        } finally {
            setLoading(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 1000);
        }
    };

    const currentUser = Cookies.get("user");

    const startChat = async (userId: string) => {
        const mydata = JSON.parse(currentUser!); // Parse user details from storage

        try {
            // Query to find existing chats
            const chatQuery = query(
                collection(db, "chats"),
                where("participants", "array-contains", mydata.id)
            );
            const existingChats = await getDocs(chatQuery);

            // Find an existing chat
            const existingChatDoc = existingChats.docs.find((doc) =>
                doc.data().participants.includes(userId)
            );

            if (existingChatDoc) {
                const existingChat: Chat = {
                    id: existingChatDoc.id,
                    participants: existingChatDoc.data().participants,
                    lastMessage: existingChatDoc.data().lastMessage,
                    lastUpdated: existingChatDoc.data().lastUpdated.toDate(), // Ensure it's a Date object
                    unreadMessages: existingChatDoc.data().unreadMessages,
                };

                navigate("/chat", { state: { chat: existingChat, userId: mydata.id } });
                return;
            }

            // Create a new chat if one doesn't exist
            const chatRef = await addDoc(collection(db, "chats"), {
                participants: [mydata.id, userId],
                unreadMessages: { [mydata.id]: 0, [userId]: 0 },
                lastMessage: "",
                lastUpdated: new Date(),
            });

            const newChat: Chat = {
                id: chatRef.id,
                participants: [mydata.id, userId],
                unreadMessages: { [mydata.id]: 0, [userId]: 0 },
                lastMessage: "",
                lastUpdated: new Date(),
            };

            navigate("/chat", { state: { chat: newChat, userId: mydata.id } });
        } catch (error) {
            console.error("Error starting chat:", error);
        }
    };



    const totalPrice = selectedPlan ? selectedPlan.monthly_fee - selectedPlan.discount : 0;

    return (
        <div className="w-full min-h-screen mt-20 bg-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full px-4 lg:px-16 py-8">
                {/* Left Section */}
                <div className="col-span-2 bg-white rounded-lg p-6 shadow-md">
                    <h1 className="text-3xl font-bold mb-8 text-blue-700">Subscription Checkout</h1>

                    {isLoading ? (
                        <SkeletonLoader /> // Show skeleton while loading
                    ) : selectedPlan ? (
                        <>
                            {/* Plan Summary */}
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4">Your Selected Plan</h2>
                                <div
                                    className="border border-gray-300 rounded-md p-4"
                                >
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
                                        className={`px-6 py-2 rounded-md text-white ${loading
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                            }`}
                                    >
                                        {loading ? "Applying..." : "Apply"}
                                    </button>
                                </div>
                                {referrerInfo && (
                                    <div className="mt-6 p-6 bg-white border border-gray-300 rounded-md shadow-md">
                                        <h3 className="text-xl font-semibold text-blue-700 mb-4">Referrer Details</h3>
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
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
                                            <button
                                                onClick={() => {
                                                    startChat(referrerInfo.id);
                                                }} // Redirect to chat page
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3 10h1m10 0h1M12 19.5h1m4 0h1M6.5 16h1m-5-4h16m0-5H8M5 10v1m14-1v1"
                                                    />
                                                </svg>
                                                Chat
                                            </button>
                                        </div>
                                        <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                                            <h4 className="text-lg font-semibold text-blue-600">Total Profit Earned</h4>
                                            <p className="text-2xl font-bold text-blue-800">
                                                ${referrerInfo.total_profit || "0.00"}
                                            </p>
                                        </div>
                                        <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                                            <h4 className="text-lg font-semibold text-blue-600">Total Sale</h4>
                                            <p className="text-2xl font-bold text-blue-800">
                                            $45,231.89
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
                                disabled={!termsAccepted || loading || !isReferralValid} // Disable the button if terms are not accepted or loading
                                className={`w-full py-3 rounded-md text-lg font-semibold text-white ${termsAccepted && !loading &&isReferralValid? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {loading ? "Subscribing..." : "Subscribe Now"}
                            </button>


                        </>
                    ) : (
                        <p className="text-red-600">Failed to load plan details.</p>
                    )}
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
