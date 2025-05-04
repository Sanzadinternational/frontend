import { Suspense } from 'react';
import Login from '@/components/payment-response-handler';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center my-8">
      <Suspense fallback={<div>Loading...</div>}>
            <payment-response-handler/>
          </Suspense>
     
    </div>
  );
}
