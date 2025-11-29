import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Calendar, MapPin, Users, Clock, ArrowRight, Star, TrendingUp, Shield } from 'lucide-react';

interface HeroPageProps {
  onGetStarted: () => void;
}

export function HeroPage({ onGetStarted }: HeroPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-10 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Calendar className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg">RoomBook</h3>
            <p className="text-xs text-muted-foreground">Smart Booking System</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={onGetStarted} variant="outline">
            Sign In
          </Button>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-120px)]">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-sm">Trusted by 500+ Organizations</span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Book Meeting Rooms{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Effortlessly
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                A modern, AI-powered room booking system designed for seamless collaboration.
                Find, book, and manage meeting spaces in seconds.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2 shadow-lg shadow-primary/20"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Learn More
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-8 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Bookings Made</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Availability</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="bg-card border rounded-2xl p-6 backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Calendar className="h-6 w-6 text-white" />
                </motion.div>
                <div className="space-y-2 flex-1">
                  <h3>Smart Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered booking assistant helps you find the perfect room based on your needs
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-card border rounded-2xl p-6 backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <MapPin className="h-6 w-6 text-white" />
                </motion.div>
                <div className="space-y-2 flex-1">
                  <h3>Real-time Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    See live room status, capacity, and equipment with interactive 3D previews
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-card border rounded-2xl p-6 backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <TrendingUp className="h-6 w-6 text-white" />
                </motion.div>
                <div className="space-y-2 flex-1">
                  <h3>Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track usage patterns, optimize space utilization with comprehensive reports
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-card border rounded-2xl p-6 backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>
                <div className="space-y-2 flex-1">
                  <h3>Enterprise Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Role-based access, audit logs, and compliance-ready security features
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-pink-400/20 to-orange-400/20 backdrop-blur-sm"
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
