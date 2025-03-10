import React, { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../../../services/services";
import { useQuery } from "@tanstack/react-query";

const MyProfile: React.FC = () => {

 const { data: user, isLoading } = useQuery({
  queryKey: ["profile"],
  queryFn: fetchProfile
});

  const [name, setName] = useState(user?.name);
  const [phone, setPhone] = useState(user?.phone);
  const [email, setEmail] = useState(user?.email);
  const [birthDate, setBirthDate] = useState(user?.date_of_birth);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
      setBirthDate(user.date_of_birth);
    }
  }, [user]);
  
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile(name, phone, email);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Your Profile</h2>
      <form onSubmit={handleSaveChanges} className="space-y-4">
        {/* Profile Details (Grid layout of two columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
              disabled={isLoading}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your last name"
              disabled={isLoading}

            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}

            />
          </div>

          {/* birthDates */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date of Birth</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="Enter your address"
              disabled={isLoading}

            />
          </div>
        </div>

        {/* Password Changes */}
        <h3 className="text-lg font-semibold mt-6">Password Changes</h3>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Current Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            disabled={isLoading}

          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={isLoading}

          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm New Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={isLoading}

          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="btn btn-outline btn-primary"
            onClick={() => {
              setName(user.name);
              setPhone(user.phone);
              setEmail(user.email);
              setBirthDate(user.date_of_birth);
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn text-white btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
