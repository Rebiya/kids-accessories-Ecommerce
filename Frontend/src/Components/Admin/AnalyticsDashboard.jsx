// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Bar, Line, Pie } from 'react-chartjs-2';
// import { 
//   FiUsers, 
//   FiShoppingCart, 
//   FiTrendingUp, 
//   FiCalendar,
//   FiRefreshCw
// } from 'react-icons/fi';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

// // Add these Chart.js registrations
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const API_BASE_URL = 'http://localhost:3000/api';
// // ... rest of your code

// const AnalyticsDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dateRange, setDateRange] = useState({
//     start: subDays(new Date(), 30),
//     end: new Date()
//   });
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     newUsers: 0,
//     totalOrders: 0,
//     newOrders: 0,
//     usersData: [],
//     ordersData: []
//   });

//   // Fetch all analytics data
//   const fetchAnalyticsData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Fetch users and orders in parallel
//       const [usersResponse, ordersResponse] = await Promise.all([
//         axios.get(`${API_BASE_URL}/users`),
//         axios.get(`${API_BASE_URL}/order`)
//       ]);
  
//       // Access the nested users array
//       const users = usersResponse.data.users || [];
//       // Orders is a direct array
//       const orders = ordersResponse.data || [];
  
//       // Process data for charts
//       const daysInRange = eachDayOfInterval({
//         start: dateRange.start,
//         end: dateRange.end
//       });
  
//       // Prepare user registration data
//       const usersByDay = daysInRange.map(day => ({
//         date: day,
//         count: users.filter(user => 
//           isSameDay(new Date(user.created_at), day)
//         ).length
//       }));
  
//       // Prepare order creation data
//       const ordersByDay = daysInRange.map(day => ({
//         date: day,
//         count: orders.filter(order => 
//           isSameDay(new Date(order.created_at), day)
//         ).length
//       }));
  
//       // Calculate stats
//       const newUsers = users.filter(user => 
//         new Date(user.created_at) >= dateRange.start
//       ).length;
  
//       const newOrders = orders.filter(order => 
//         new Date(order.created_at) >= dateRange.start
//       ).length;
  
//       setStats({
//         totalUsers: users.length,
//         newUsers,
//         totalOrders: orders.length,
//         newOrders,
//         usersData: usersByDay,
//         ordersData: ordersByDay
//       });
//     } catch (err) {
//       setError('Failed to fetch analytics data');
//       console.error('Analytics fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnalyticsData();
//   }, [dateRange]);

//   // Prepare chart data
//   const getChartData = (data, label, color) => {
//     return {
//       labels: data.map(item => format(item.date, 'MMM dd')),
//       datasets: [{
//         label,
//         data: data.map(item => item.count),
//         backgroundColor: color,
//         borderColor: color,
//         borderWidth: 1
//       }]
//     };
//   };

//   // Calculate percentage change
//   const calculateChange = (current, previous) => {
//     if (previous === 0) return 100;
//     return ((current - previous) / previous) * 100;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
//             <p className="text-gray-600 mt-2">Track user and order metrics</p>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
//             <div className="flex items-center gap-2">
//               <FiCalendar className="text-gray-500" />
//               <DatePicker
//                 selected={dateRange.start}
//                 onChange={date => setDateRange({...dateRange, start: date})}
//                 selectsStart
//                 startDate={dateRange.start}
//                 endDate={dateRange.end}
//                 className="border rounded p-2"
//               />
//               <span>to</span>
//               <DatePicker
//                 selected={dateRange.end}
//                 onChange={date => setDateRange({...dateRange, end: date})}
//                 selectsEnd
//                 startDate={dateRange.start}
//                 endDate={dateRange.end}
//                 minDate={dateRange.start}
//                 className="border rounded p-2"
//               />
//             </div>
//             <button
//               onClick={fetchAnalyticsData}
//               className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//             >
//               <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {/* Total Users */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm font-medium">Total Users</p>
//                 <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
//                 <p className="text-green-600 text-sm mt-1 flex items-center">
//                   <FiTrendingUp className="mr-1" />
//                   {calculateChange(stats.totalUsers, stats.totalUsers - stats.newUsers)}% from last period
//                 </p>
//               </div>
//               <div className="bg-indigo-100 p-3 rounded-full">
//                 <FiUsers className="text-indigo-600 text-xl" />
//               </div>
//             </div>
//           </div>

//           {/* New Users */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm font-medium">New Users</p>
//                 <h3 className="text-2xl font-bold mt-1">{stats.newUsers}</h3>
//                 <p className="text-green-600 text-sm mt-1">
//                   {((stats.newUsers / stats.totalUsers) * 100 || 0).toFixed(1)}% of total
//                 </p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-full">
//                 <FiUsers className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>

//           {/* Total Orders */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm font-medium">Total Orders</p>
//                 <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
//                 <p className="text-green-600 text-sm mt-1 flex items-center">
//                   <FiTrendingUp className="mr-1" />
//                   {calculateChange(stats.totalOrders, stats.totalOrders - stats.newOrders)}% from last period
//                 </p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-full">
//                 <FiShoppingCart className="text-purple-600 text-xl" />
//               </div>
//             </div>
//           </div>

//           {/* New Orders */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm font-medium">New Orders</p>
//                 <h3 className="text-2xl font-bold mt-1">{stats.newOrders}</h3>
//                 <p className="text-green-600 text-sm mt-1">
//                   {((stats.newOrders / stats.totalOrders) * 100 || 0).toFixed(1)}% of total
//                 </p>
//               </div>
//               <div className="bg-yellow-100 p-3 rounded-full">
//                 <FiShoppingCart className="text-yellow-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* User Registrations Over Time */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <h3 className="text-lg font-semibold mb-4 flex items-center">
//               <FiUsers className="mr-2" />
//               User Registrations
//             </h3>
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
//               </div>
//             ) : (
//               <Line
//                 data={getChartData(stats.usersData, 'New Users', 'rgba(79, 70, 229, 0.6)')}
//                 options={{
//                   responsive: true,
//                   plugins: {
//                     legend: {
//                       position: 'top',
//                     },
//                   },
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       ticks: {
//                         precision: 0
//                       }
//                     }
//                   }
//                 }}
//               />
//             )}
//           </div>

//           {/* Orders Over Time */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <h3 className="text-lg font-semibold mb-4 flex items-center">
//               <FiShoppingCart className="mr-2" />
//               Order Activity
//             </h3>
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
//               </div>
//             ) : (
//               <Bar
//                 data={getChartData(stats.ordersData, 'New Orders', 'rgba(124, 58, 237, 0.6)')}
//                 options={{
//                   responsive: true,
//                   plugins: {
//                     legend: {
//                       position: 'top',
//                     },
//                   },
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       ticks: {
//                         precision: 0
//                       }
//                     }
//                   }
//                 }}
//               />
//             )}
//           </div>
//         </div>

//         {/* Additional Metrics */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* User to Order Ratio */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <h3 className="text-lg font-semibold mb-4">User to Order Ratio</h3>
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
//               </div>
//             ) : (
//               <Pie
//                 data={{
//                   labels: ['Users', 'Orders'],
//                   datasets: [{
//                     data: [stats.totalUsers, stats.totalOrders],
//                     backgroundColor: [
//                       'rgba(79, 70, 229, 0.6)',
//                       'rgba(124, 58, 237, 0.6)'
//                     ],
//                     borderColor: [
//                       'rgba(79, 70, 229, 1)',
//                       'rgba(124, 58, 237, 1)'
//                     ],
//                     borderWidth: 1
//                   }]
//                 }}
//                 options={{
//                   responsive: true,
//                   plugins: {
//                     legend: {
//                       position: 'top',
//                     },
//                     tooltip: {
//                       callbacks: {
//                         label: function(context) {
//                           const total = context.dataset.data.reduce((a, b) => a + b, 0);
//                           const value = context.raw;
//                           const percentage = Math.round((value / total) * 100);
//                           return `${context.label}: ${value} (${percentage}%)`;
//                         }
//                       }
//                     }
//                   }
//                 }}
//               />
//             )}
//           </div>

//           {/* Daily Averages */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-2">
//             <h3 className="text-lg font-semibold mb-4">Daily Averages</h3>
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-gray-50 p-4 rounded">
//                   <p className="text-gray-500 text-sm">Users per day</p>
//                   <h4 className="text-xl font-bold mt-1">
//                     {(stats.newUsers / daysBetween(dateRange.start, dateRange.end)).toFixed(1)}
//                   </h4>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <p className="text-gray-500 text-sm">Orders per day</p>
//                   <h4 className="text-xl font-bold mt-1">
//                     {(stats.newOrders / daysBetween(dateRange.start, dateRange.end)).toFixed(1)}
//                   </h4>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <p className="text-gray-500 text-sm">Orders per user</p>
//                   <h4 className="text-xl font-bold mt-1">
//                     {(stats.totalOrders / stats.totalUsers || 0).toFixed(1)}
//                   </h4>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper function to calculate days between dates
// function daysBetween(start, end) {
//   const diffTime = Math.abs(end - start);
//   return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
// }

// export default AnalyticsDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  FiUsers,
  FiShoppingCart,
  FiTrendingUp,
  FiCalendar,
  FiRefreshCw
} from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

// Add these Chart.js registrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = 'http://localhost:3000/api';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalOrders: 0,
    newOrders: 0,
    usersData: [],
    ordersData: []
  });

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users and orders in parallel
      const [usersResponse, ordersResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/order`)
      ]);

      // Convert single user response to array
      const usersData = usersResponse.data.users;
const users = Array.isArray(usersData) ? usersData : (usersData ? [usersData] : []);


      // Orders is a direct array
      const orders = ordersResponse.data || [];

      // Process data for charts
      const daysInRange = eachDayOfInterval({
        start: dateRange.start,
        end: dateRange.end
      });

      // Prepare user registration data
      const usersByDay = daysInRange.map(day => ({
        date: day,
        count: users.filter(user => 
          user.created_at && isSameDay(new Date(user.created_at), day)
        ).length
      }));

      // Prepare order creation data
      const ordersByDay = daysInRange.map(day => ({
        date: day,
        count: orders.filter(order => 
          order.created_at && isSameDay(new Date(order.created_at), day)
        ).length
      }));

      // Calculate stats
      const newUsers = users.filter(user => 
        user.created_at && new Date(user.created_at) >= dateRange.start
      ).length;

      const newOrders = orders.filter(order => 
        order.created_at && new Date(order.created_at) >= dateRange.start
      ).length;

      setStats({
        totalUsers: users.length,
        newUsers,
        totalOrders: orders.length,
        newOrders,
        usersData: usersByDay,
        ordersData: ordersByDay
      });
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  // Prepare chart data
  const getChartData = (data, label, color) => {
    return {
      labels: data.map(item => format(item.date, 'MMM dd')),
      datasets: [{
        label,
        data: data.map(item => item.count),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
      }]
    };
  };

  // Calculate percentage change
  const calculateChange = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track user and order metrics</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-500" />
              <DatePicker
                selected={dateRange.start}
                onChange={date => setDateRange({...dateRange, start: date})}
                selectsStart
                startDate={dateRange.start}
                endDate={dateRange.end}
                className="border rounded p-2"
              />
              <span>to</span>
              <DatePicker
                selected={dateRange.end}
                onChange={date => setDateRange({...dateRange, end: date})}
                selectsEnd
                startDate={dateRange.start}
                endDate={dateRange.end}
                minDate={dateRange.start}
                className="border rounded p-2"
              />
            </div>
            <button
              onClick={fetchAnalyticsData}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <FiTrendingUp className="mr-1" />
                  {calculateChange(stats.totalUsers, stats.totalUsers - stats.newUsers)}% from last period
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <FiUsers className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>

          {/* New Users */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">New Users</p>
                <h3 className="text-2xl font-bold mt-1">{stats.newUsers}</h3>
                <p className="text-green-600 text-sm mt-1">
                  {((stats.newUsers / stats.totalUsers) * 100 || 0).toFixed(1)}% of total
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiUsers className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <FiTrendingUp className="mr-1" />
                  {calculateChange(stats.totalOrders, stats.totalOrders - stats.newOrders)}% from last period
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FiShoppingCart className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          {/* New Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">New Orders</p>
                <h3 className="text-2xl font-bold mt-1">{stats.newOrders}</h3>
                <p className="text-green-600 text-sm mt-1">
                  {((stats.newOrders / stats.totalOrders) * 100 || 0).toFixed(1)}% of total
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FiShoppingCart className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Registrations Over Time */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiUsers className="mr-2" />
              User Registrations
            </h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <Line
                data={getChartData(stats.usersData, 'New Users', 'rgba(79, 70, 229, 0.6)')}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            )}
          </div>

          {/* Orders Over Time */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiShoppingCart className="mr-2" />
              Order Activity
            </h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <Bar
                data={getChartData(stats.ordersData, 'New Orders', 'rgba(124, 58, 237, 0.6)')}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User to Order Ratio */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">User to Order Ratio</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <Pie
                data={{
                  labels: ['Users', 'Orders'],
                  datasets: [{
                    data: [stats.totalUsers, stats.totalOrders],
                    backgroundColor: [
                      'rgba(79, 70, 229, 0.6)',
                      'rgba(124, 58, 237, 0.6)'
                    ],
                    borderColor: [
                      'rgba(79, 70, 229, 1)',
                      'rgba(124, 58, 237, 1)'
                    ],
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const value = context.raw;
                          const percentage = Math.round((value / total) * 100);
                          return `${context.label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            )}
          </div>

          {/* Daily Averages */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-2">
            <h3 className="text-lg font-semibold mb-4">Daily Averages</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-500 text-sm">Users per day</p>
                  <h4 className="text-xl font-bold mt-1">
                    {(stats.newUsers / daysBetween(dateRange.start, dateRange.end)).toFixed(1)}
                  </h4>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-500 text-sm">Orders per day</p>
                  <h4 className="text-xl font-bold mt-1">
                    {(stats.newOrders / daysBetween(dateRange.start, dateRange.end)).toFixed(1)}
                  </h4>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-500 text-sm">Orders per user</p>
                  <h4 className="text-xl font-bold mt-1">
                    {(stats.totalOrders / stats.totalUsers || 0).toFixed(1)}
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate days between dates
function daysBetween(start, end) {
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
}

export default AnalyticsDashboard;