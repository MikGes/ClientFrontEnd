'use client';

import { useEffect, useState } from 'react';
import { FaUsers, FaBox, FaClipboardList, FaChartLine, FaSyncAlt, FaEnvelope, FaChair, FaMobileAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

// Types based on your API response
interface RecentUser {
  _id: string;
  email: string;
  createdAt: string;
}

interface Furniture {
  _id: string;
  furniture_name: string;
  furniture_type: string;
}

interface RecentRequest {
  _id: string;
  orderedBy: { email: string };
  ordered_furniture: Furniture;
  phoneNumber: string;
  createdAt: string;
}

interface RecentProduct {
  _id: string;
  furniture_name: string;
  furniture_type: string;
  createdAt: string;
}

interface RecentActivitiesData {
  recentUser: RecentUser | null;
  recentRequest: RecentRequest | null;
  recentProduct: RecentProduct | null;
}

export default function DashboardPage() {
  const [activities, setActivities] = useState<RecentActivitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      // ✅ Replace with your actual endpoint
      const res = await fetch('https://back-thrumming-star-8653.fly.dev/admin/getRecentActivities', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch data');
      const result = await res.json();
      setActivities(result.data);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  // Format time (e.g., "2 hours ago")
  const formatTime = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  // Mock stats (replace with real counts when available)
  const stats = [
    { title: 'Total Products', value: '—', change: '—', icon: <FaBox className="text-2xl text-amber-700" /> },
    { title: 'New Requests', value: '—', change: '—', icon: <FaClipboardList className="text-2xl text-amber-700" /> },
    { title: 'Subscribers', value: '—', change: '—', icon: <FaUsers className="text-2xl text-amber-700" /> },
    { title: 'Revenue', value: '—', change: '—', icon: <FaChartLine className="text-2xl text-amber-700" /> },
  ];

  // Build dynamic activity list
  const recentActivity = [];

  if (activities?.recentProduct) {
    recentActivity.push({
      id: 'product',
      action: 'New product added',
      item: activities?.recentProduct?.furniture_name,
      time: formatTime(activities?.recentProduct?.createdAt),
      icon: <FaChair className="text-amber-700" />,
    });
  }

  if (activities?.recentRequest) {
    recentActivity.push({
      id: 'request',
      action: 'New request received',
      item: `${activities?.recentRequest?.ordered_furniture?.furniture_name} • ${activities?.recentRequest?.orderedBy?.email}`,
      time: formatTime(activities?.recentRequest?.createdAt),
      icon: <FaClipboardList className="text-amber-700" />,
    });
  }

  if (activities?.recentUser) {
    recentActivity.push({
      id: 'user',
      action: 'New subscriber',
      item: activities.recentUser.email,
      time: formatTime(activities.recentUser.createdAt),
      icon: <FaEnvelope className="text-amber-700" />,
    });
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900">Dashboard</h1>
        <p className="text-amber-700 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards (placeholder — replace with real data later) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-amber-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-amber-900 mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <span className="text-amber-500 text-xs">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-amber-900">Recent Activity</h2>
          <button
            onClick={fetchRecentActivities}
            disabled={loading}
            className="flex items-center text-amber-700 hover:text-amber-900 disabled:opacity-50"
          >
            <FaSyncAlt className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <p className="text-amber-600 italic">Loading recent activity...</p>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start pb-4 border-b border-amber-100 last:border-0 last:pb-0"
              >
                <div className="bg-amber-100 p-2 rounded-lg mr-4">{activity.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-amber-900">{activity.action}</p>
                  <p className="text-amber-700 mt-1 text-sm">{activity.item}</p>
                </div>
                <span className="text-amber-500 text-sm whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-amber-600 italic">No recent activity found.</p>
        )}
      </div>

      {/* Last Updated */}
      <div className="mt-6 text-center text-amber-600 text-sm">
        Last updated: {lastUpdated.toLocaleString()}
      </div>
    </div>
  );
}