
'use client';
import { useEffect } from 'react';

export default function PaymentResponseHandler() {
  useEffect(() => {
    const form = document.forms[0];
    const formData = new FormData(form);
    fetch('https://api.sanzadinternational.in/api/V1/payment/payment-status-update', {
      method: 'POST',
      body: formData,
    }).then(() => {
      window.location.href = '/thank-you';
    });
  }, []);

  return <form method="POST"><p>Processing payment response...</p></form>;
}