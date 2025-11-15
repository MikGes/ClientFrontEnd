// app/actions/createUser.ts
'use server';

import jwt from 'jsonwebtoken';

export async function createUser(email: string) {
  // Step 1: Generate short-lived JWT
  const token = jwt.sign(
    { purpose: 'create-user', email },
    process.env.JWT_CLIENT_SECRET!,
    { expiresIn: '3s' }
  );

  // Step 2: Make POST request with token in Authorization header
  const res: any = await fetch('https://back-thrumming-star-8653.fly.dev/users/createUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, token }),
  });
  const resBody = await res.json()
  if (!res.ok) {
    return { success: resBody.success, message: resBody.message }
  }
  return await res.json();
}