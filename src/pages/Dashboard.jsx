@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { useNavigate } from 'react-router-dom';
+import { BarChart3, TrendingUp, Users, CreditCard, Heart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
 import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
 import { adherentsAPI, soinsAPI, cotisationsAPI } from '../services/api';
 import { useRecentActivity } from '../hooks/useRecentActivity';
+import ModernCard from '../components/UI/ModernCard';
+import ModernButton from '../components/UI/ModernButton';
 
 const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
@@ .. @@
   const statCards = [
     {
       title: 'Total Adhérents',
       value: stats.totalAdherents,
-      icon: 'bi-people',
-      color: '#3b82f6',
-      bgColor: '#dbeafe',
+      icon: Users,
       change: '+12%',
       changeType: 'positive',
       path: '/adherents'
     },
     {
       title: 'Total Cotisations',
       value: stats.totalCotisations,
-      icon: 'bi-credit-card',
-      color: '#10b981',
-      bgColor: '#d1fae5',
+      icon: CreditCard,
       change: '+8%',
       changeType: 'positive',
       path: '/cotisations'
     },
     {
       title: 'Total Soins',
       value: stats.totalSoins,
-      icon: 'bi-heart-pulse',
-      color: '#f59e0b',
-      bgColor: '#fef3c7',
+      icon: Heart,
       change: '+15%',
       changeType: 'positive',
       path: '/soins'
     },
     {
       title: 'Dossiers Reçus',
       value: stats.soinsRecu,
-      icon: 'bi-check-circle',
-      color: '#10b981',
-      bgColor: '#d1fae5',
+      icon: Activity,
       change: '+5%',
       changeType: 'positive',
       path: '/soins'
     }
   ];

   const quickActions = [
     {
       title: 'Ajouter Adhérent',
-      icon: 'bi-person-plus',
-      color: '#10b981',
-      bgColor: '#d1fae5',
+      icon: Users,
       action: () => navigate('/adherents')
     },
     {
       title: 'Nouveau Dossier Soin',
-      icon: 'bi-heart-pulse',
-      color: '#f59e0b',
-      bgColor: '#fef3c7',
+      icon: Heart,
       action: () => navigate('/soins')
     },
     {
       title: 'Gérer Cotisations',
-      icon: 'bi-credit-card',
-      color: '#3b82f6',
-      bgColor: '#dbeafe',
+      icon: CreditCard,
       action: () => navigate('/cotisations')
     }
   ];

   if (stats.loading) {
     return (
-      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
-        <div className="text-center">
-          <div className="spinner-border text-primary mb-3" role="status">
-            <span className="visually-hidden">Chargement...</span>
+      <div className="flex items-center justify-center min-h-96">
+        <div className="text-center">
+          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
+          <p className="text-secondary">Chargement du tableau de bord...</p>
         </div>
-        <p className="text-muted">Chargement du tableau de bord...</p>
       </div>
-      </div>
     );
   }

   return (
-    <div className="fade-in">
+    <div className="animate-fade-in space-y-8">
       {/* Header */}
-      <div className="row mb-4">
-        <div className="col">
-          <h1 className="display-6 fw-bold mb-2">Tableau de Bord</h1>
-          <p className="text-muted fs-5">Vue d'ensemble de votre système de gestion mutualiste</p>
-        </div>
-        <div className="col-auto">
-          <div className="d-flex gap-2">
-            <button className="btn btn-primary" onClick={fetchDashboardData}>
-              <i className="bi bi-arrow-clockwise me-2"></i>Actualiser
-            </button>
+      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
+        <div>
+          <h1 className="text-3xl font-bold text-primary mb-2">Tableau de Bord</h1>
+          <p className="text-secondary">Vue d'ensemble de votre système de gestion mutualiste</p>
+        </div>
+        <div className="mt-4 sm:mt-0">
+          <ModernButton
+            variant="accent"
+            onClick={fetchDashboardData}
+            icon={<Activity className="w-4 h-4" />}
+          >
+            Actualiser
+          </ModernButton>
         </div>
       </div>

       {/* Stats Cards */}
-      <div className="row g-4 mb-5">
+      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         {statCards.map((stat, index) => (
-          <div key={stat.title} className="col-xl-3 col-md-6">
-            <motion.div
-              initial={{ opacity: 0, y: 20 }}
-              animate={{ opacity: 1, y: 0 }}
-              transition={{ delay: index * 0.1 }}
-              className="stat-card h-100 cursor-pointer"
-              onClick={() => navigate(stat.path)}
-              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
-            >
-              <div className="d-flex align-items-center justify-content-between mb-3">
-                <div>
-                  <p className="text-muted mb-1 fw-medium">{stat.title}</p>
-                  <h2 className="fw-bold mb-0" style={{ color: stat.color }}>
-                    {stat.value.toLocaleString()}
-                  </h2>
-                </div>
-                <div 
-                  className="rounded-circle d-flex align-items-center justify-content-center"
-                  style={{ 
-                    width: '60px', 
-                    height: '60px', 
-                    backgroundColor: stat.bgColor 
-                  }}
-                >
-                  <i className={`${stat.icon} fs-3`} style={{ color: stat.color }}></i>
+          <motion.div
+            key={stat.title}
+            initial={{ opacity: 0, y: 20 }}
+            animate={{ opacity: 1, y: 0 }}
+            transition={{ delay: index * 0.1 }}
+          >
+            <ModernCard
+              className="cursor-pointer h-full"
+              onClick={() => navigate(stat.path)}
+              hover={true}
+            >
+              <div className="flex items-center justify-between mb-4">
+                <div className="flex-1">
+                  <p className="text-secondary text-sm font-medium mb-1">{stat.title}</p>
+                  <h3 className="text-2xl font-bold text-primary">
+                    {stat.value.toLocaleString()}
+                  </h3>
                 </div>
+                <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-xl flex items-center justify-center">
+                  <stat.icon className="w-6 h-6 text-accent" />
+                </div>
               </div>
-              <div className="d-flex align-items-center">
-                <span className={`badge ${stat.changeType === 'positive' ? 'bg-success' : 'bg-danger'} me-2`}>
-                  <i className={`bi ${stat.changeType === 'positive' ? 'bi-arrow-up' : 'bi-arrow-down'} me-1`}></i>
-                  {stat.change}
+              <div className="flex items-center">
+                <span className={`badge ${stat.changeType === 'positive' ? 'badge-success' : 'badge-error'} mr-2`}>
+                  {stat.changeType === 'positive' ? (
+                    <ArrowUpRight className="w-3 h-3" />
+                  ) : (
+                    <ArrowDownRight className="w-3 h-3" />
+                  )}
+                  <span className="ml-1">{stat.change}</span>
                 </span>
-                <small className="text-muted">vs mois dernier</small>
+                <span className="text-sm text-tertiary">vs mois dernier</span>
               </div>
-            </motion.div>
-          </div>
+            </ModernCard>
+          </motion.div>
         ))}
       </div>

       {/* Charts Row */}
-      <div className="row g-4 mb-5">
+      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         {/* Bar Chart */}
-        <div className="col-xl-8">
-          <div className="chart-container">
-            <div className="d-flex align-items-center justify-content-between mb-4">
-              <div>
-                <h4 className="fw-bold mb-1">Évolution des Soins</h4>
-                <p className="text-muted mb-0">Nombre de dossiers par mois</p>
-              </div>
-              <div className="dropdown">
-                <button className="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
-                  Cette année
-                </button>
-                <ul className="dropdown-menu">
-                  <li><a className="dropdown-item" href="#">Cette année</a></li>
-                  <li><a className="dropdown-item" href="#">6 derniers mois</a></li>
-                  <li><a className="dropdown-item" href="#">3 derniers mois</a></li>
-                </ul>
-              </div>
+        <div className="xl:col-span-2">
+          <ModernCard>
+            <div className="flex items-center justify-between mb-6">
+              <div>
+                <h3 className="text-xl font-bold text-primary mb-1">Évolution des Soins</h3>
+                <p className="text-secondary">Nombre de dossiers par mois</p>
+              </div>
+              <ModernButton variant="ghost" size="sm">
+                Cette année
+              </ModernButton>
             </div>
-            <ResponsiveContainer width="100%" height={350}>
+            <ResponsiveContainer width="100%" height={300}>
               <BarChart data={chartData}>
-                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
+                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                 <XAxis 
                   dataKey="month" 
-                  stroke="#64748b"
+                  stroke="var(--text-tertiary)"
                   fontSize={12}
                 />
                 <YAxis 
-                  stroke="#64748b"
+                  stroke="var(--text-tertiary)"
                   fontSize={12}
                 />
                 <Tooltip 
                   contentStyle={{
-                    backgroundColor: 'white',
-                    border: '1px solid #e2e8f0',
-                    borderRadius: '8px',
-                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
+                    backgroundColor: 'var(--bg-primary)',
+                    border: '1px solid var(--border-light)',
+                    borderRadius: 'var(--radius-lg)',
+                    boxShadow: 'var(--shadow-md)'
                   }}
                 />
                 <Bar 
                   dataKey="soins" 
-                  fill="#3b82f6" 
+                  fill="var(--color-accent)" 
                   radius={[4, 4, 0, 0]}
                 />
               </BarChart>
             </ResponsiveContainer>
-          </div>
+          </ModernCard>
         </div>

         {/* Pie Chart */}
-        <div className="col-xl-4">
-          <div className="chart-container">
-            <div className="mb-4">
-              <h4 className="fw-bold mb-1">Statut des Dossiers</h4>
-              <p className="text-muted mb-0">Répartition des dossiers de soins</p>
+        <div>
+          <ModernCard>
+            <div className="mb-6">
+              <h3 className="text-xl font-bold text-primary mb-1">Statut des Dossiers</h3>
+              <p className="text-secondary">Répartition des dossiers de soins</p>
             </div>
-            <ResponsiveContainer width="100%" height={350}>
+            <ResponsiveContainer width="100%" height={300}>
               <PieChart>
                 <Pie
                   data={pieData}
@@ -245,7 +245,7 @@
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
-          </div>
+          </ModernCard>
         </div>
       </div>

       {/* Activity Feed & Quick Actions */}
-      <div className="row g-4">
+      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         {/* Recent Activity */}
-        <div className="col-xl-8">
-          <div className="card border-0 shadow-sm">
-            <div className="card-header  border-0 pb-0">
-              <div className="d-flex align-items-center justify-content-between">
-                <div>
-                  <h5 className="fw-bold mb-1">Activité Récente</h5>
-                  <p className="text-muted mb-0">Dernières actions effectuées</p>
-                </div>
+        <div className="xl:col-span-2">
+          <ModernCard>
+            <div className="mb-6">
+              <h3 className="text-xl font-bold text-primary mb-1">Activité Récente</h3>
+              <p className="text-secondary">Dernières actions effectuées</p>
             </div>
-            <div className="card-body">
-              {activitiesLoading ? (
-                <div className="text-center py-4">
-                  <div className="spinner-border spinner-border-sm text-primary" role="status">
-                    <span className="visually-hidden">Chargement...</span>
-                  </div>
+            {activitiesLoading ? (
+              <div className="text-center py-8">
+                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
+              </div>
+            ) : (
+              <div className="space-y-4">
+                {activities.map((activity, index) => (
+                  <motion.div 
+                    key={activity.id}
+                    initial={{ opacity: 0, x: -20 }}
+                    animate={{ opacity: 1, x: 0 }}
+                    transition={{ delay: index * 0.1 }}
+                    className="flex items-start space-x-4 p-4 bg-secondary rounded-xl"
+                  >
+                    <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
+                      <Activity className="w-5 h-5 text-accent" />
+                    </div>
+                    <div className="flex-1 min-w-0">
+                      <h4 className="font-semibold text-primary mb-1">{activity.title}</h4>
+                      <p className="text-secondary text-sm mb-2">{activity.description}</p>
+                      <span className="text-xs text-tertiary">{activity.time}</span>
+                    </div>
+                  </motion.div>
+                ))}
+                {activities.length === 0 && (
+                  <div className="text-center py-8">
+                    <Activity className="w-12 h-12 text-tertiary mx-auto mb-3" />
+                    <p className="text-secondary">Aucune activité récente</p>
+                  </div>
                 )}
-              ) : (
-                <div className="timeline">
-                  {activities.map((activity, index) => (
-                    <motion.div 
-                      key={activity.id}
-                      initial={{ opacity: 0, x: -20 }}
-                      animate={{ opacity: 1, x: 0 }}
-                      transition={{ delay: index * 0.1 }}
-                      className="d-flex align-items-start mb-4"
-                    >
-                      <div 
-                        className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
-                        style={{ 
-                          width: '40px', 
-                          height: '40px', 
-                          backgroundColor: activity.bgColor 
-                        }}
-                      >
-                        <i className={`${activity.icon} fs-5`} style={{ color: activity.color }}></i>
-                      </div>
-                      <div className="flex-grow-1">
-                        <h6 className="fw-semibold mb-1">{activity.title}</h6>
-                        <p className="text-muted mb-1">{activity.description}</p>
-                        <small className="text-muted">{activity.time}</small>
-                      </div>
-                    </motion.div>
-                  ))}
-                  {activities.length === 0 && (
-                    <div className="text-center py-4">
-                      <i className="bi bi-clock-history display-4 text-muted mb-3"></i>
-                      <p className="text-muted">Aucune activité récente</p>
-                    </div>
-                  )}
-                </div>
-              )}
-            </div>
-          </div>
+              </div>
+            )}
+          </ModernCard>
         </div>

         {/* Quick Actions */}
-        <div className="col-xl-4">
-          <div className="card border-0 shadow-sm">
-            <div className="card-header  border-0 pb-0">
-              <h5 className="fw-bold mb-1">Actions Rapides</h5>
-              <p className="text-muted mb-0">Raccourcis fréquemment utilisés</p>
+        <div>
+          <ModernCard>
+            <div className="mb-6">
+              <h3 className="text-xl font-bold text-primary mb-1">Actions Rapides</h3>
+              <p className="text-secondary">Raccourcis fréquemment utilisés</p>
             </div>
-            <div className="card-body">
-              <div className="d-grid gap-3">
+            <div className="space-y-3">
                 {quickActions.map((action, index) => (
-                  <motion.button
+                  <ModernButton
                     key={index}
-                    className="btn  text-start p-3 border-0 shadow-sm"
+                    variant="ghost"
+                    className="w-full justify-start"
                     onClick={action.action}
-                    whileHover={{ scale: 1.02 }}
-                    whileTap={{ scale: 0.98 }}
-                    initial={{ opacity: 0, y: 20 }}
-                    animate={{ opacity: 1, y: 0 }}
-                    transition={{ delay: index * 0.1 }}
+                    icon={<action.icon className="w-5 h-5" />}
                   >
-                    <div className="d-flex align-items-center">
-                      <div 
-                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
-                        style={{ 
-                          width: '40px', 
-                          height: '40px', 
-                          backgroundColor: action.bgColor 
-                        }}
-                      >
-                        <i className={`${action.icon} fs-5`} style={{ color: action.color }}></i>
-                      </div>
-                      <div>
-                        <h6 className="fw-semibold mb-0">{action.title}</h6>
-                      </div>
-                      <i className="bi bi-chevron-right ms-auto text-muted"></i>
-                    </div>
-                  </motion.button>
+                    {action.title}
+                  </ModernButton>
                 ))}
-              </div>
             </div>
-          </div>
+          </ModernCard>
         </div>
       </div>
     </div>