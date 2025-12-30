'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/actions';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      className="w-full mt-4 bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400" 
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Sedang Masuk...' : 'Masuk Dashboard'}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login Admin</h1>
        
        {/* Panggil dispatch di action form */}
        <form action={dispatch} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              className="w-full border p-3 rounded-lg bg-gray-50 text-black"
              id="username"
              type="text"
              name="username"
              placeholder="Masukkan username (admin)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              className="w-full border p-3 rounded-lg bg-gray-50 text-black"
              id="password"
              type="password"
              name="password"
              placeholder="Masukkan password"
              required
            />
          </div>
          
          <LoginButton />
          
          {/* Pesan Error */}
          <div className="flex h-8 items-end space-x-1">
            {errorMessage && (
              <p className="text-sm text-red-500 w-full text-center font-medium">
                ⚠️ {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}