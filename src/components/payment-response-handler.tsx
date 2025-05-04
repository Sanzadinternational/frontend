'use client';
import { useEffect } from 'react';

export default function PaymentResponseHandler() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encResp = urlParams.get('encResp');

    if (!encResp) return;

    const form = document.createElement('form');
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'encResp';
    input.value = encResp;

    form.appendChild(input);

    const formData = new FormData(form);

    fetch('https://api.sanzadinternational.in/api/V1/payment/payment-status-update', {
      method: 'POST',
      body: formData,
    }).then(() => {
      window.location.href = '/thank-you';
    });
  }, []);

  return <p>Processing payment response...</p>;
}
