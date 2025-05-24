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
import styles from './Analytics.module.css';

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

const API_BASE_URL = 'http://44.202.218.119:3000/api';

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

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, ordersResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/order`)
      ]);

      const usersData = usersResponse.data.users;
      const users = Array.isArray(usersData) ? usersData : (usersData ? [usersData] : []);
      const orders = ordersResponse.data || [];

      const daysInRange = eachDayOfInterval({
        start: dateRange.start,
        end: dateRange.end
      });

      const usersByDay = daysInRange.map(day => ({
        date: day,
        count: users.filter(user => 
          user.created_at && isSameDay(new Date(user.created_at), day)
        ).length
      }));

      const ordersByDay = daysInRange.map(day => ({
        date: day,
        count: orders.filter(order => 
          order.created_at && isSameDay(new Date(order.created_at), day)
        ).length
      }));

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

  const calculateChange = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>Analytics Dashboard</h1>
            <p className={styles.headerSubtitle}>Track user and order metrics</p>
          </div>

          <div className={styles.controls}>
            <div className={styles.datePickerContainer}>
              <FiCalendar className={styles.statIcon} />
              <DatePicker
                selected={dateRange.start}
                onChange={date => setDateRange({...dateRange, start: date})}
                selectsStart
                startDate={dateRange.start}
                endDate={dateRange.end}
                className={styles.datePicker}
              />
              <span>to</span>
              <DatePicker
                selected={dateRange.end}
                onChange={date => setDateRange({...dateRange, end: date})}
                selectsEnd
                startDate={dateRange.start}
                endDate={dateRange.end}
                minDate={dateRange.start}
                className={styles.datePicker}
              />
            </div>
            <button
              onClick={fetchAnalyticsData}
              className={styles.refreshButton}
              disabled={loading}
            >
              <FiRefreshCw className={loading ? styles.spinner : ''} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <p className={styles.statTitle}>Total Users</p>
                <h3 className={styles.statValue}>{stats.totalUsers}</h3>
                <p className={styles.statTrend}>
                  <FiTrendingUp className={styles.statIcon} />
                  {calculateChange(stats.totalUsers, stats.totalUsers - stats.newUsers)}% from last period
                </p>
              </div>
              <div className={styles.statIconContainer}>
                <FiUsers className={styles.statIcon} />
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <p className={styles.statTitle}>New Users</p>
                <h3 className={styles.statValue}>{stats.newUsers}</h3>
                <p className={styles.statTrend}>
                  {((stats.newUsers / stats.totalUsers) * 100 || 0).toFixed(1)}% of total
                </p>
              </div>
              <div className={styles.statIconContainer}>
                <FiUsers className={styles.statIcon} />
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <p className={styles.statTitle}>Total Orders</p>
                <h3 className={styles.statValue}>{stats.totalOrders}</h3>
                <p className={styles.statTrend}>
                  <FiTrendingUp className={styles.statIcon} />
                  {calculateChange(stats.totalOrders, stats.totalOrders - stats.newOrders)}% from last period
                </p>
              </div>
              <div className={styles.statIconContainer}>
                <FiShoppingCart className={styles.statIcon} />
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <p className={styles.statTitle}>New Orders</p>
                <h3 className={styles.statValue}>{stats.newOrders}</h3>
                <p className={styles.statTrend}>
                  {((stats.newOrders / stats.totalOrders) * 100 || 0).toFixed(1)}% of total
                </p>
              </div>
              <div className={styles.statIconContainer}>
                <FiShoppingCart className={styles.statIcon} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <FiUsers className={styles.statIcon} />
              User Registrations
            </h3>
            {loading ? (
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
              </div>
            ) : (
              <Line
                data={getChartData(stats.usersData, 'New Users', 'rgba(249, 176, 46, 0.6)')}
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

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              <FiShoppingCart className={styles.statIcon} />
              Order Activity
            </h3>
            {loading ? (
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
              </div>
            ) : (
              <Bar
                data={getChartData(stats.ordersData, 'New Orders', 'rgba(249, 176, 46, 0.6)')}
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

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <h3 className={styles.chartTitle}>User to Order Ratio</h3>
            {loading ? (
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
              </div>
            ) : (
              <Pie
                data={{
                  labels: ['Users', 'Orders'],
                  datasets: [{
                    data: [stats.totalUsers, stats.totalOrders],
                    backgroundColor: [
                      'rgba(249, 176, 46, 0.6)',
                      'rgba(220, 38, 38, 0.6)'
                    ],
                    borderColor: [
                      'rgba(249, 176, 46, 1)',
                      'rgba(220, 38, 38, 1)'
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

          <div className={styles.metricCard} style={{ gridColumn: 'span 2' }}>
            <h3 className={styles.chartTitle}>Daily Averages</h3>
            {loading ? (
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
              </div>
            ) : (
              <div className={styles.metricsSubGrid}>
                <div className={styles.metricItem}>
                  <p className={styles.metricLabel}>Users per day</p>
                  <h4 className={styles.metricValue}>
                    {(stats.newUsers / daysBetween(dateRange.start, dateRange.end)).toFixed(1)}
                  </h4>
                </div>
                <div className={styles.metricItem}>
                  <p className={styles.metricLabel}>Orders per day</p>
                  <h4 className={styles.metricValue}>
                    {(stats.newOrders / daysBetween(dateRange.start, dateRange.end)).toFixed(1)}
                  </h4>
                </div>
                <div className={styles.metricItem}>
                  <p className={styles.metricLabel}>Orders per user</p>
                  <h4 className={styles.metricValue}>
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

function daysBetween(start, end) {
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
}

export default AnalyticsDashboard;