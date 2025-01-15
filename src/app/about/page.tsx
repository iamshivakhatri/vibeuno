'use client'

import React from 'react'
import { motion } from 'framer-motion'

const CoolCreatedByShiva = () => {
  return (
    <div className="min-h-screen bg-grey flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-black mb-6"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Created by
        </motion.h1>
        <motion.div
          className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Shiva
        </motion.div>
        <motion.p
          className="mt-8 text-xl text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Crafting digital travel experiences with passion
        </motion.p>
      </motion.div>
    </div>
  )
}

export default CoolCreatedByShiva

