"use client"

import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, UserPlus, Heart, Sparkles } from "lucide-react"
import { useAuth } from "../contexts/AuthContext.jsx"
import Button from "../components/UI/Button"
import Input from "../components/UI/Input"
import Alert from "../components/UI/Alert"

export default function Signup() {
  const { signup, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)

    if (formData.password !== formData.password_confirm) {
      setAlert({
        type: "error",
        message: "Les mots de passe ne correspondent pas",
      })
      setLoading(false)
      return
    }

    const result = await signup(formData)

    if (!result.success) {
      setAlert({
        type: "error",
        message: result.message,
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary-400/20 to-accent-400/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-soft-lg border border-gray-200/50 dark:border-gray-700/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-accent-500 to-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft-lg relative"
            >
              <Heart className="w-10 h-10 text-white" />
              <Sparkles className="w-4 h-4 text-white/60 absolute -top-1 -right-1 animate-pulse" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Inscription
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Créez votre compte MutuCare</p>
          </div>

          {/* Alert */}
          {alert && (
            <div className="mb-6">
              <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                placeholder="Prénom"
              />
              <Input
                label="Nom"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                placeholder="Nom"
              />
            </div>

            <Input
              label="Nom d'utilisateur"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Nom d'utilisateur"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="email@exemple.com"
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Mot de passe (min. 8 caractères)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirmer le mot de passe"
                name="password_confirm"
                type={showPasswordConfirm ? "text" : "password"}
                value={formData.password_confirm}
                onChange={handleInputChange}
                required
                placeholder="Confirmez votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-4 top-11 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-6"
              startIcon={<UserPlus className="w-5 h-5" />}
            >
              S'inscrire
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 font-semibold transition-colors duration-200"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 inline-block">
            MODEP - Mutuelle des Employés Portuaires
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
