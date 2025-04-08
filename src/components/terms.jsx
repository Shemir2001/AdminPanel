import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Terms of Use (End User License Agreement - EULA)</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-700">1. Acceptance of Terms</h2>
          <p className="mt-2 text-gray-600">
            By downloading, installing, or using RBB ToolBox (the "App"), you agree to abide by these Terms of Use (the "Agreement"). 
            If you do not agree to these terms, you must not use the App.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">2. License Grant</h2>
          <p className="mt-2 text-gray-600">
            RBB ToolBox grants you a limited, non-exclusive, non-transferable, and revocable license to use the App 
            for personal and non-commercial purposes, subject to these Terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">3. User Obligations and Restrictions</h2>
          <p className="mt-2 text-gray-600">You agree that you will NOT:</p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>Use the App for illegal or unauthorized purposes.</li>
            <li>Attempt to reverse-engineer, decompile, or modify the App.</li>
            <li>Share, resell, or distribute the App's content without permission.</li>
            <li>Use the App in any way that could harm its functionality or other users.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">4. Premium Features & Subscriptions</h2>
          <p className="mt-2 text-gray-600">
            Certain features, such as Past Entries, Favorites & Reminders, and Recordings, are available only to Premium users. 
            These features may require a one-time payment or a subscription. By subscribing, you agree to the payment terms 
            specified in the App Store or Google Play.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">5. Data Privacy</h2>
          <p className="mt-2 text-gray-600">
            We respect your privacy. Your data is handled according to our Privacy Policy. 
            The App may collect and store certain personal and non-personal data for functionality purposes.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">6. Intellectual Property</h2>
          <p className="mt-2 text-gray-600">
            All content, trademarks, and intellectual property within the App remain the exclusive property of RBB ToolBox. 
            You may not copy, modify, or distribute any content from the App without written permission.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">7. Disclaimers & Limitation of Liability</h2>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>The App is provided "AS IS" without any warranties.</li>
            <li>RBB ToolBox is not responsible for any loss, damage, or harm resulting from your use of the App.</li>
            <li>While we strive to maintain accuracy and reliability, we do not guarantee that the App will always be error-free or uninterrupted.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">8. Termination</h2>
          <p className="mt-2 text-gray-600">
            Your access to the App may be terminated if you violate these Terms. You may also stop using the App at any time.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">9. Changes to the Agreement</h2>
          <p className="mt-2 text-gray-600">
            We reserve the right to update these Terms at any time. Continued use of the App after modifications 
            constitutes your acceptance of the new Terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">10. Governing Law</h2>
          <p className="mt-2 text-gray-600">
            This Agreement shall be governed by the laws of Australia. Any disputes must be resolved in the courts of Australia.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-700">11. Contact Information</h2>
          <p className="mt-2 text-gray-600">
            If you have any questions or concerns about this Agreement, please contact us at:
            <a href="mailto:rbbtoolbox@gmail.com" className="text-blue-600 hover:underline ml-1">
              rbbtoolbox@gmail.com
            </a>
          </p>
        </section>
      </div>
      
     
    </div>
  );
};

export default TermsOfUse;