import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { adherentsAPI, soinsAPI, cotisationsAPI } from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAdherents: 0,
    totalCotisations: 0,
    totalSoins: 0,
    montantRembourse: 0,
    soinsRecu: 0,
    soinsRejet: 0,
    loading: true
  });

  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

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
      const montantTotal = soins.reduce((sum, soin) => sum + parseFloat(soin.montant_dossier || 0), 0);

      setStats({
        totalAdherents: adherents.length,
        totalCotisations: cotisations.length,
        totalSoins: soins.length,
        montantRembourse: montantTotal,
        soinsRecu,
        soinsRejet,
        loading: false
      });

      // Prepare monthly chart data
      const monthlyData = {};
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      
      months.forEach(month => {
        monthlyData[month] = 0;
      });

      soins.forEach(soin => {
        const month = months[new Date(soin.date_soin).getMonth()];
        monthlyData[month] += 1;
      });

      const chartDataArray = months.map(month => ({
        month,
        soins: monthlyData[month],
        montant: Math.floor(Math.random() * 50000) + 10000 // Données simulées
      }));

      setChartData(chartDataArray);

      // Prepare pie chart data
      const pieDataArray = [
        { name: 'Dossiers Reçus', value: soinsRecu, color: '#10b981' },
        { name: 'Dossiers Rejetés', value: soinsRejet, color: '#ef4444' }
      ];

      setPieData(pieDataArray);

      // Recent activities (simulated)
      setRecentActivities([
        {
          id: 1,
          type: 'adherent',
          title: 'Nouvel adhérent',
          description: 'Mohammed Alami a rejoint la mutuelle',
          time: 'Il y a 2h',
          status: 'success'
        },
        {
          id: 2,
          type: 'soin',
          title: 'Dossier de soin traité',
          description: 'Dossier #12345 validé pour 2,500 MAD',
          time: 'Il y a 4h',
          status: 'success'
        },
        {
          id: 3,
          type: 'cotisation',
          title: 'Cotisation reçue',
          description: 'Paiement de 450 MAD reçu',
          time: 'Il y a 6h',
          status: 'warning'
        },
        {
          id: 4,
          type: 'soin',
          title: 'Dossier rejeté',
          description: 'Dossier #12344 rejeté - documents manquants',
          time: 'Il y a 1j',
          status: 'error'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      title: 'Adhésions du mois',
      value: stats.totalAdherents,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'primary',
      path: '/adherents'
    },
    {
      title: 'Cotisations reçues',
      value: `${stats.totalCotisations.toLocaleString()} MAD`,
      change: '+8%',
      changeType: 'positive',
      icon: CreditCard,
      color: 'success',
      path: '/cotisations'
    },
    {
      title: 'Soins traités',
      value: stats.totalSoins,
      change: '+15%',
      changeType: 'positive',
      icon: Heart,
      color: 'warning',
      path: '/soins'
    },
    {
      title: 'Montant remboursé',
      value: `${Math.floor(stats.montantRembourse).toLocaleString()} MAD`,
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'purple',
      path: '/soins'
    }
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Tableau de bord</h1>
          <p className="text-secondary">Vue d'ensemble de votre système de gestion mutualiste</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button className="btn btn-secondary btn-sm">
            <Calendar className="w-4 h-4" />
            <span>Cette semaine</span>
          </button>
          <button className="btn btn-primary">
            <Filter className="w-4 h-4" />
            <span>Filtrer</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`stat-card ${stat.color} cursor-pointer`}
              onClick={() => navigate(stat.path)}
            >
              <div className="stat-header">
                <div className={`stat-icon ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <button className="p-1 hover:bg-tertiary rounded-md transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-tertiary" />
                </button>
              </div>
              
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.title}</div>
              
              <div className={`stat-change ${stat.changeType}`}>
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>{stat.change}</span>
                <span className="text-tertiary">vs mois dernier</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2">
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Évolution des soins</h3>
                <p className="chart-subtitle">Nombre de dossiers traités par mois</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-sm">
                  <span>2024</span>
                </button>
                <button className="p-1 hover:bg-tertiary rounded-md transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--text-tertiary)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--text-tertiary)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Bar 
                  dataKey="soins" 
                  fill="url(#gradient1)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div>
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Statut des dossiers</h3>
                <p className="chart-subtitle">Répartition des traitements</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-primary)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-secondary">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Activité récente</h3>
              <button className="btn btn-ghost btn-sm">
                Voir tout
              </button>
            </div>
            <div className="card-body p-0">
              <div className="space-y-1">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="activity-item"
                  >
                    <div className={`activity-icon ${
                      activity.status === 'success' ? 'bg-success bg-opacity-10 text-success' :
                      activity.status === 'warning' ? 'bg-warning bg-opacity-10 text-warning' :
                      activity.status === 'error' ? 'bg-error bg-opacity-10 text-error' :
                      'bg-accent bg-opacity-10 text-accent'
                    }`}>
                      {activity.type === 'adherent' && <Users className="w-4 h-4" />}
                      {activity.type === 'soin' && <Heart className="w-4 h-4" />}
                      {activity.type === 'cotisation' && <CreditCard className="w-4 h-4" />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-description">{activity.description}</div>
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Actions rapides</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/adherents')}
                  className="btn btn-primary w-full justify-start"
                >
                  <Users className="w-4 h-4" />
                  <span>Ajouter un adhérent</span>
                </button>
                <button
                  onClick={() => navigate('/soins')}
                  className="btn btn-secondary w-full justify-start"
                >
                  <Heart className="w-4 h-4" />
                  <span>Nouveau dossier soin</span>
                </button>
                <button
                  onClick={() => navigate('/cotisations')}
                  className="btn btn-secondary w-full justify-start"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Gérer cotisations</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="card-title">Statistiques rapides</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary">Taux d'acceptation</span>
                  <span className="font-semibold text-success">
                    {stats.totalSoins > 0 ? Math.round((stats.soinsRecu / stats.totalSoins) * 100) : 0}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill success"
                    style={{ 
                      width: stats.totalSoins > 0 ? `${(stats.soinsRecu / stats.totalSoins) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary">Adhérents actifs</span>
                  <span className="font-semibold text-accent">85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary">Cotisations à jour</span>
                  <span className="font-semibold text-warning">92%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill warning" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}