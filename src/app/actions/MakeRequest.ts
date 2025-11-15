// app/actions/createUser.ts
'use server';

import jwt from 'jsonwebtoken';

export async function makeRequest(email: string, phone: string, furnitureId: any) {
    // Step 1: Generate short-lived JWT
    const token = jwt.sign(
        { purpose: 'create-user', email },
        process.env.JWT_CLIENT_SECRET!,
        { expiresIn: '3s' }
    );

    // Step 2: Make POST request with token in Authorization header
    const response = await fetch(`https://back-thrumming-star-8653.fly.dev/users/order/${furnitureId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            phone,
            furnitureId,
            token,
        }),
    });

    const resBody = await response.json()
    console.log(resBody)
    if (!response.ok) {
        return { success: resBody.success, message: resBody.message }
    }
    return resBody;
}