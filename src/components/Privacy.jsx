import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="w-screen mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold text-center mb-4">Privacy Policy</h1>
        
        <div className="text-gray-700">
          <p className="mb-4">
            Your privacy is important to us. This privacy policy explains how we collect, use, and protect
            your personal information when you visit our website.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">1. Information We Collect</h2>
          <p className="mb-2">We may collect the following types of information:</p>
          <ul className="space-y-1 pl-6">
            <li>- Personal identification information (Name, email etc.)</li>
            <li>- Usage data (IP address, browser type, etc.)</li>
            <li>- Cookies and tracking technologies</li>
            <li>- Payment information for Premium Subscriptions</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
          <p className="mb-2">The information we collect is used in the following ways:</p>
          <ul className="space-y-1 pl-6">
            <li>- To provide, operate, and maintain our website</li>
            <li>- To improve user experience and personalize your interaction</li>
            <li>- To communicate with you directly</li>
            <li>- To comply with legal obligations</li>
            <li>- To manage Premium Subscriptions, including auto-renewal processes</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">3. Sharing of Information</h2>
          <p className="mb-2">
            We do not share your personal information with third parties, except under the following
            circumstances:
          </p>
          <ul className="space-y-1 pl-6">
            <li>- To comply with legal obligations</li>
            <li>- With your explicit consent</li>
            <li>- For business transfers or restructuring</li>
            <li>- To process payments for Premium Subscriptions</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">4. Security of Your Information</h2>
          <p className="mb-2">
            We implement security measures to protect your personal data. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">5. Premium Subscription</h2>
          <p className="mb-2">
            We offer a Premium Subscription service that is auto-renewable:
          </p>
          <ul className="space-y-1 pl-6">
            <li>- Monthly: $2.99 USD</li>
            <li>- Yearly: $29.99 USD</li>
          </ul>
          <p className="mt-2">
            Your subscription will automatically renew at the end of the subscription period unless auto-renew is turned off at least 24 hours before the end of the current period. You can manage your subscription and turn off auto-renewal by accessing your account settings.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">6. Changes to This Privacy Policy</h2>
          <p className="mb-2">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">7. Contact Us</h2>
          <p className="mb-2">
            If you have any questions or concerns about this Privacy Policy, you can contact us at:
          </p>
          <ul className="space-y-1 pl-6">
            <li>- Email: rbbtoolbox@gmail.com</li>
            <li>- Phone: +61479134710</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;