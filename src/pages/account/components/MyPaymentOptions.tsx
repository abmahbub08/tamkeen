import React, { useState } from "react";

const MyPaymentOptions: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [ccv, setCCV] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "card") {
      console.log({
        paymentMethod,
        cardNumber,
        ccv,
        expirationMonth,
        expirationYear,
      });
    } else {
      console.log({
        paymentMethod,
      });
    }
  };

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Only keep digits
    if (value.length > 16) value = value.slice(0, 16); // Max 16 digits
    setCardNumber(value);
  };

  const formatCardNumber = (number: string) => {
    return number.match(/.{1,4}/g)?.join(" ") || number;
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Payment Options</h2>
      <form onSubmit={handleConfirm} className="space-y-4">
        {/* Radio for Cash Payments */}
        <div className="form-control">
          <label className="cursor-pointer flex items-center space-x-4">
            <input
              type="radio"
              name="paymentMethod"
              className="radio radio-primary"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            <span className="label-text">Cash Payments</span>
          </label>
          <p className="pl-8 text-sm text-gray-500">Standard cash handling.</p>
        </div>

        {/* Radio for Card Payments */}
        <div className="form-control">
          <label className="cursor-pointer flex items-center space-x-4">
            <input
              type="radio"
              name="paymentMethod"
              className="radio radio-primary"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            <span className="label-text">
              Card Payments: Credit/debit card processing
            </span>
          </label>
          <p className="pl-8 text-sm text-gray-500">
            The card is swiped, or the data is entered manually. The card is
            verified and the transaction is completed.
          </p>
        </div>

        {/* Show card details form if "Card Payments" is selected */}
        {paymentMethod === "card" && (
          <div className="space-y-4">
            {/* Card Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Card Number</span>
              </label>
              <input
                type="text"
                maxLength={19}
                className="input input-bordered w-full"
                placeholder="**** **** **** ****"
                value={formatCardNumber(cardNumber)}
                onChange={handleCardNumberChange}
                required
              />
            </div>

            {/* CCV */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">CCV</span>
              </label>
              <input
                type="text"
                maxLength={3}
                className="input input-bordered w-24 text-center"
                placeholder="***"
                value={ccv}
                onChange={(e) => setCCV(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>

            {/* Expiration Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Expiration Date</span>
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  maxLength={2}
                  className="input input-bordered w-16 text-center"
                  placeholder="MM"
                  value={expirationMonth}
                  onChange={(e) =>
                    setExpirationMonth(e.target.value.replace(/\D/g, ""))
                  }
                  required
                />
                <input
                  type="text"
                  maxLength={4}
                  className="input input-bordered w-20 text-center"
                  placeholder="YYYY"
                  value={expirationYear}
                  onChange={(e) =>
                    setExpirationYear(e.target.value.replace(/\D/g, ""))
                  }
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <div className="form-control">
          <button type="submit" className="btn text-white btn-primary w-full">
            CONFIRM
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyPaymentOptions;
