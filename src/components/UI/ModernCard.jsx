import React from 'react';
import { motion } from 'framer-motion';

export default function ModernCard({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'p-6',
  ...props 
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: "var(--shadow-md)" } : {}}
      transition={{ duration: 0.2 }}
      className={`card ${padding} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}