// app/(dashboard)/layout.tsx — or wherever your layout lives
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import SideBar from './SideBar';

export default function DashLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const verifyToken = async () => {
            try {
                const res = await fetch('https://back-thrumming-star-8653.fly.dev/admin/verify-token', {
                    method: 'POST',
                    credentials: 'include', // sends cookies (e.g., session/refresh token)
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();

                if (isMounted) {
                    if (res.ok && data.is_authenticated) {
                        setIsAuthenticated(true);
                    } else {
                        // Redirect *before* setting loading to false to avoid flash
                        router.replace('/Login');
                    }
                }
            } catch (error) {
                console.warn('Token verification failed:', error);
                if (isMounted) {
                    router.replace('/Login');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        verifyToken();

        return () => {
            isMounted = false; // prevent state update on unmounted component
        };
    }, [router, pathname]);

    // While verifying, show a sleek loading screen (no layout jump)
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/95 backdrop-blur-sm">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                    <p className="text-emerald-400 font-mono text-sm tracking-wider">
                        [●] Establishing secure session...
                    </p>
                    {/* Optional: subtle terminal scanline effect */}
                    <div className="mt-6 h-1 w-32 bg-amber-600/30 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-amber-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Only render layout if authenticated
    if (!isAuthenticated) {
        return null; // redirect is already triggered
    }

    return (
        <div className="flex min-h-screen bg-amber-50">
            <SideBar />
            <main className="ml-64 flex-1 p-6">{children}</main>
        </div>
    );
}