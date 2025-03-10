import React, { useState } from "react";

const AddressBook: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartmentInfo, setApartmentInfo] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle saving logic here
    console.log({
      companyName,
      streetAddress,
      apartmentInfo,
      city,
      phoneNumber,
      emailAddress,
      saveInfo,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Address Book</h2>
      <form onSubmit={handleSave} className="space-y-4">
        {/* Company Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Company Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        {/* Street Address */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Street Address*</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="Enter street address"
            required
          />
        </div>

        {/* Apartment Info */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Apartment, floor, etc. (optional)</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={apartmentInfo}
            onChange={(e) => setApartmentInfo(e.target.value)}
            placeholder="Enter apartment, floor, etc."
          />
        </div>

        {/* Town/City */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Town/City*</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter town/city"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number*</span>
          </label>
          <input
            type="tel"
            className="input input-bordered"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* Email Address */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email Address*</span>
          </label>
          <input
            type="email"
            className="input input-bordered"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        {/* Save Info Checkbox */}
        <div className="form-control">
          <label className="cursor-pointer label">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={saveInfo}
              onChange={() => setSaveInfo(!saveInfo)}
            />
            <span className="label-text pl-2">
              Save this information for faster define location
            </span>
          </label>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressBook;
