import React, { useState } from "react";

const AccountDeletion = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., send email to server)
    alert(`Account deletion requested for: ${email}`);
  };

  return (
    <div className="min-h-screen bg-teal-900 flex items-center justify-center">
      <div className="bg-teal-800 p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-4">
          {/* Logo */}
          <div className="bg-white rounded-full p-3">
            <span className="text-teal-800 font-extrabold text-xl">EC</span>
          </div>
        </div>

        <h1 className="text-white text-2xl font-semibold text-center">
          Easy Credit Repairs
        </h1>

        <h2 className="text-white text-lg font-medium text-center mt-2">
          Request for Account Deletion
        </h2>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border-2 border-white bg-teal-700 text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountDeletion;
