import React from 'react'
import SideBar from './SideBar';
export default function DashLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
                  <div className="flex min-h-screen bg-amber-50">
                    <SideBar />
                    <div className="ml-64 flex-1 p-6">
                        {children}
                    </div>
                </div>
    );
}
