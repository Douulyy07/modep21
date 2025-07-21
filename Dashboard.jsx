import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { adherentsAPI, soinsAPI, cotisationsAPI } from '../services/api';
import { useRecentActivity } from '../hooks/useRecentActivity';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { activities, loading: activitiesLoading } = useRecentActivity();
  const [stats, setStats] = useState({
    totalAdherents: 0,
    totalCotisations: 0,
    totalSoins: 0,
    soinsRecu: 0,
    soinsRejet: 0,
    loading: true
  });

  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [adherentsRes, cotisationsRes, soinsRes] = await Promise.all([
        adherentsAPI.getAll(),
        cotisationsAPI.getAll(),
        soinsAPI.getAll()
      ]);

      const adherents = adherentsRes.data;
      const cotisations = cotisationsRes.data;
      const soins = soinsRes.data;

      const soinsRecu = soins.filter(s => s.statut_dossier === 'recu').length;
      const soinsRejet = soins.filter(s => s.statut_dossier === 'rejet').length;

      setStats({
        totalAdherents: adherents.length,
        totalCotisations: cotisations.length,
        totalSoins: soins.length,
        soinsRecu,
        soinsRejet,
        loading: false
      });

      // Prepare monthly chart data
      const monthlyData = {};
      soins.forEach(soin => {
        const month = new Date(soin.date_soin).toLocaleDateString('fr-FR', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      const chartDataArray = Object.entries(monthlyData).map(([month, count]) => ({
        month,
        soins: count
      }));

      setChartData(chartDataArray);

      // Prepare pie chart data
      const pieDataArray = [
        { name: 'Dossiers Reçus', value: soinsRecu, color: '#10b981' },
        { name: 'Dossiers Rejetés', value: soinsRejet, color: '#ef4444' }
      ];

      setPieData(pieDataArray);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      title: 'Total Adhérents',
      value: stats.totalAdherents,
      icon: 'bi-people',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      change: '+12%',
      changeType: 'positive',
      path: '/adherents'
    },
    {
      title: 'Total Cotisations',
      value: stats.totalCotisations,
      icon: 'bi-credit-card',
      color: '#10b981',
      bgColor: '#d1fae5',
      change: '+8%',
      changeType: 'positive',
      path: '/cotisations'
    },
    {
      title: 'Total Soins',
      value: stats.totalSoins,
      icon: 'bi-heart-pulse',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      change: '+15%',
      changeType: 'positive',
      path: '/soins'
    },
    {
      title: 'Dossiers Reçus',
      value: stats.soinsRecu,
      icon: 'bi-check-circle',
      color: '#10b981',
      bgColor: '#d1fae5',
      change: '+5%',
      changeType: 'positive',
      path: '/soins'
    }
  ];

  const quickActions = [
    {
      title: 'Ajouter Adhérent',
      icon: 'bi-person-plus',
      color: '#10b981',
      bgColor: '#d1fae5',
      action: () => navigate('/adherents')
    },
    {
      title: 'Nouveau Dossier Soin',
      icon: 'bi-heart-pulse',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      action: () => navigate('/soins')
    },
    {
      title: 'Gérer Cotisations',
      icon: 'bi-credit-card',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      action: () => navigate('/cotisations')
    }
  ];

  if (stats.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="text-muted">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-6 fw-bold mb-2">Tableau de Bord</h1>
          <p className="text-muted fs-5">Vue d'ensemble de votre système de gestion mutualiste</p>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={fetchDashboardData}>
              <i className="bi bi-arrow-clockwise me-2"></i>Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {statCards.map((stat, index) => (
          <div key={stat.title} className="col-xl-3 col-md-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="stat-card h-100 cursor-pointer"
              onClick={() => navigate(stat.path)}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <p className="text-muted mb-1 fw-medium">{stat.title}</p>
                  <h2 className="fw-bold mb-0" style={{ color: stat.color }}>
                    {stat.value.toLocaleString()}
                  </h2>
                </div>
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: stat.bgColor 
                  }}
                >
                  <i className={`${stat.icon} fs-3`} style={{ color: stat.color }}></i>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className={`badge ${stat.changeType === 'positive' ? 'bg-success' : 'bg-danger'} me-2`}>
                  <i className={`bi ${stat.changeType === 'positive' ? 'bi-arrow-up' : 'bi-arrow-down'} me-1`}></i>
                  {stat.change}
                </span>
                <small className="text-muted">vs mois dernier</small>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-5">
        {/* Bar Chart */}
        <div className="col-xl-8">
          <div className="chart-container">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h4 className="fw-bold mb-1">Évolution des Soins</h4>
                <p className="text-muted mb-0">Nombre de dossiers par mois</p>
              </div>
              <div className="dropdown">
                <button className="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                  Cette année
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Cette année</a></li>
                  <li><a className="dropdown-item" href="#">6 derniers mois</a></li>
                  <li><a className="dropdown-item" href="#">3 derniers mois</a></li>
                </ul>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="soins" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-xl-4">
          <div className="chart-container">
            <div className="mb-4">
              <h4 className="fw-bold mb-1">Statut des Dossiers</h4>
              <p className="text-muted mb-0">Répartition des dossiers de soins</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Feed & Quick Actions */}
      <div className="row g-4">
        {/* Recent Activity */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header  border-0 pb-0">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="fw-bold mb-1">Activité Récente</h5>
                  <p className="text-muted mb-0">Dernières actions effectuées</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              {activitiesLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : (
                <div className="timeline">
                  {activities.map((activity, index) => (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="d-flex align-items-start mb-4"
                    >
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          backgroundColor: activity.bgColor 
                        }}
                      >
                        <i className={`${activity.icon} fs-5`} style={{ color: activity.color }}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-semibold mb-1">{activity.title}</h6>
                        <p className="text-muted mb-1">{activity.description}</p>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </motion.div>
                  ))}
                  {activities.length === 0 && (
                    <div className="text-center py-4">
                      <i className="bi bi-clock-history display-4 text-muted mb-3"></i>
                      <p className="text-muted">Aucune activité récente</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header  border-0 pb-0">
              <h5 className="fw-bold mb-1">Actions Rapides</h5>
              <p className="text-muted mb-0">Raccourcis fréquemment utilisés</p>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    className="btn  text-start p-3 border-0 shadow-sm"
                    onClick={action.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          backgroundColor: action.bgColor 
                        }}
                      >
                        <i className={`${action.icon} fs-5`} style={{ color: action.color }}></i>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-0">{action.title}</h6>
                      </div>
                      <i className="bi bi-chevron-right ms-auto text-muted"></i>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}