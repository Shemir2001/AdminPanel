import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className=" py-12  sm:px-6 lg:px-8 w-full h-full ">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md w-full">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Privacy Policy
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6">
          Your privacy is important to us. This privacy policy explains how we
          collect, use, and protect your personal information when you visit our
          website.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may collect the following types of information:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed">
            <li>Personal identification information (Name, email address, etc.)</li>
            <li>Usage data (IP address, browser type, etc.)</li>
            <li>Cookies and tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The information we collect is used in the following ways:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed">
            <li>To provide, operate, and maintain our website</li>
            <li>To improve user experience and personalize your interaction</li>
            <li>To communicate with you directly</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. Sharing of Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We do not share your personal information with third parties, except
            under the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed">
            <li>To comply with legal obligations</li>
            <li>With your explicit consent</li>
            <li>For business transfers or restructuring</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Security of Your Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We implement security measures to protect your personal data. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions or concerns about this Privacy Policy, you
            can contact us at:
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Email:</strong> privacy@example.com
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Phone:</strong> +123-456-7890
          </p>
        </section>

        <div className="text-center mt-10">
          <p className="text-gray-500">Last updated: October 23, 2024</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
