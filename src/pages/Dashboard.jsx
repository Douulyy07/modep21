@@ .. @@
 import React from 'react';
 import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 import { AuthProvider } from './contexts/AuthContext.jsx';
 import PrivateRoute from './components/PrivateRoute';
-import AppLayout from './components/Layout/AppLayout';
+import ModernAppLayout from './components/Layout/ModernAppLayout';
+import './styles/globals.css';
 
 // Auth pages
 import Login from './pages/login';
@@ .. @@
           <Route path="/dashboard" element={
             <PrivateRoute>
-              <AppLayout>
+              <ModernAppLayout>
                 <Dashboard />
-              </AppLayout>
+              </ModernAppLayout>
             </PrivateRoute>
           } />
           
           <Route path="/adherents" element={
             <PrivateRoute>
-              <AppLayout>
+              <ModernAppLayout>
                 <Adherents />
-              </AppLayout>
+              </ModernAppLayout>
             </PrivateRoute>
           } />
           
           <Route path="/cotisations" element={
             <PrivateRoute>
-              <AppLayout>
+              <ModernAppLayout>
                 <Cotisations />
-              </AppLayout>
+              </ModernAppLayout>
             </PrivateRoute>
           } />
           
           <Route path="/soins" element={
             <PrivateRoute>
-              <AppLayout>
+              <ModernAppLayout>
                 <Soins />
-              </AppLayout>
+              </ModernAppLayout>
             </PrivateRoute>
           } />