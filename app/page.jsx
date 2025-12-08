"use client";

import AdDisplay from "@/components/AdDisplay";
import NavBar from "@/components/NavBar";
import PublicUpload from "@/components/PublicUpload";
import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  GlobalOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  StarFilled,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar, Collapse, Typography } from "antd";
import { motion } from "framer-motion";
import { Download, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10"></div>

      {/* Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="absolute -top-[40%] -right-[20%] w-[100%] h-[100%] rounded-full bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/40 blur-3xl animate-pulse"></div>
        <div className="absolute top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-blue-200/30 via-cyan-200/20 to-teal-200/30 blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute -bottom-[20%] right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-violet-200/30 via-fuchsia-200/20 to-rose-200/30 blur-3xl animate-pulse [animation-delay:4s]"></div>
      </div>

      <NavBar />

      {/* Hero Section */}
      <main className="flex-grow relative">
        <section className="relative overflow-hidden pt-32 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Premium Badge */}
                <span className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold mb-8 shadow-xl">
                  <Sparkles className="w-4 h-4" />
                  New: 64MB File Support + Auto Compression
                  <Zap className="w-4 h-4" />
                </span>

                {/* Massive Title */}
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tighter">
                  Secure Storage for{" "}
                  <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Modern Teams
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                  Experience <span className="font-bold text-indigo-600">lightning-fast</span> uploads,{" "}
                  <span className="font-bold text-purple-600">military-grade</span> encryption,
                  and <span className="font-bold text-pink-600">seamless</span> sharing.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                  <Link href="/register">
                    <button className="group relative overflow-hidden px-12 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-3">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <RocketOutlined className="relative text-xl" />
                      <span className="relative">START FOR FREE</span>
                      <Sparkles className="relative w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
                    </button>
                  </Link>

                  <Link href="/pricing">
                    <button className="px-12 py-5 bg-white/80 backdrop-blur text-gray-700 border-2 border-gray-200 rounded-2xl font-black text-lg hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex items-center gap-3">
                      VIEW PRICING
                      <Download className="w-5 h-5" />
                    </button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-semibold">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Bank-Level Security
                  </span>
                  <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    Lightning Fast
                  </span>
                  <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>No Credit Card Required</span>
                </div>
              </motion.div>

              {/* Public Upload Component - Premium Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mt-20 relative"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-3xl opacity-20 rounded-[4rem]"></div>

                {/* Card Container */}
                <div className="relative bg-white/70 backdrop-blur-2xl rounded-[3rem] p-2 shadow-2xl border border-white/60">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-[2.5rem] p-6 md:p-8">
                    <PublicUpload />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <AdDisplay placement="home_top" />

        {/* Stats Section - Glassmorphism */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/60">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <StatItem number="10M+" label="Files Stored" delay={0} />
                <StatItem number="99.9%" label="Uptime" delay={0.1} />
                <StatItem number="50k+" label="Active Users" delay={0.2} />
                <StatItem number="24/7" label="Support" delay={0.3} />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Everything you need
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                Powerful features to help you manage your digital assets with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<CloudUploadOutlined className="text-5xl" />}
                iconBg="from-blue-500 to-indigo-600"
                title="Smart Uploads"
                description="Drag & drop interface with auto-compression and image optimization. Files are resized and metadata stripped for security."
                delay={0}
              />
              <FeatureCard
                icon={<SafetyCertificateOutlined className="text-5xl" />}
                iconBg="from-green-500 to-emerald-600"
                title="Bank-Level Security"
                description="File validation, size limits, and secure authentication. Rate limiting protects against abuse."
                delay={0.1}
              />
              <FeatureCard
                icon={<RocketOutlined className="text-5xl" />}
                iconBg="from-purple-500 to-pink-600"
                title="API Access"
                description="Integrate file storage into your own apps with our REST API. Generate API keys from your dashboard."
                delay={0.2}
              />
              <FeatureCard
                icon={<CheckCircleOutlined className="text-5xl" />}
                iconBg="from-orange-500 to-red-600"
                title="Flexible Plans"
                description="Choose from multiple subscription tiers. Upgrade or downgrade anytime to match your needs."
                delay={0.3}
              />
              <FeatureCard
                icon={<TeamOutlined className="text-5xl" />}
                iconBg="from-teal-500 to-cyan-600"
                title="File Management"
                description="Upload, view, and delete your files. Admin dashboard for complete control over your storage."
                delay={0.4}
              />
              <FeatureCard
                icon={<GlobalOutlined className="text-5xl" />}
                iconBg="from-indigo-500 to-blue-600"
                title="Secure Sharing"
                description="Store your files securely and access them from anywhere. Each file gets a unique URL."
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                Loved by <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Developers</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our community has to say.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                name="Sarah Chen"
                role="Frontend Lead @ Tech Corp"
                content="The API is a joy to work with. We integrated file uploads into our app in less than an hour."
                delay={0}
              />
              <TestimonialCard
                name="Mark Davis"
                role="Freelance Designer"
                content="Finally, a storage solution that looks good and works perfectly. The sharing features are a lifesaver."
                delay={0.2}
              />
              <TestimonialCard
                name="Alex Rivera"
                role="CTO @ StartupX"
                content="Security was our top priority, and FileStore delivered. The granular permissions are exactly what we needed."
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Frequently Asked <span className="text-indigo-600">Questions</span>
              </h2>
            </div>
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
              <Collapse ghost size="large" expandIconPlacement="end">
                <Panel header={<span className="text-lg font-bold">Is there a free plan?</span>} key="1">
                  <p className="text-gray-600 text-base">
                    Yes! Our free plan includes 5GB of storage and all core features. No credit card required.
                  </p>
                </Panel>
                <Panel header={<span className="text-lg font-bold">How secure is my data?</span>} key="2">
                  <p className="text-gray-600 text-base">
                    We use AES-256 encryption for files at rest and TLS for data in transit. Your data is safe with us.
                  </p>
                </Panel>
                <Panel header={<span className="text-lg font-bold">Can I upgrade later?</span>} key="3">
                  <p className="text-gray-600 text-base">
                    Absolutely. You can upgrade or downgrade your plan at any time from your dashboard.
                  </p>
                </Panel>
                <Panel header={<span className="text-lg font-bold">Do you offer an API?</span>} key="4">
                  <p className="text-gray-600 text-base">
                    Yes, we offer a comprehensive REST API for developers to integrate storage into their applications.
                  </p>
                </Panel>
              </Collapse>
            </div>
          </div>
        </section>

        {/* CTA Section - Premium */}
        <section className="py-32 relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to get started?
              </h2>
              <p className="text-2xl text-white/90 mb-12">
                Join thousands of developers and teams who trust us with their data.
              </p>
              <Link href="/register">
                <button className="px-16 py-6 bg-white text-indigo-600 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-3 mx-auto">
                  <Sparkles className="w-6 h-6" />
                  CREATE FREE ACCOUNT
                  <Sparkles className="w-6 h-6" />
                </button>
              </Link>
              <p className="mt-8 text-white/80 font-semibold">
                No credit card required • Cancel anytime • 64MB file support
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, iconBg, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/60 hover:-translate-y-2"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>

      <div className={`relative w-16 h-16 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      <h3 className="relative text-2xl font-black text-gray-900 mb-4">{title}</h3>
      <p className="relative text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StatItem({ number, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
        {number}
      </div>
      <div className="text-gray-600 font-bold text-lg">{label}</div>
    </motion.div>
  );
}

function TestimonialCard({ name, role, content, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>

      <div className="relative flex gap-1 text-yellow-400 mb-6 text-xl">
        <StarFilled />
        <StarFilled />
        <StarFilled />
        <StarFilled />
        <StarFilled />
      </div>

      <p className="relative text-gray-700 text-lg italic mb-8 leading-relaxed font-medium">
        "{content}"
      </p>

      <div className="relative flex items-center gap-4">
        <Avatar
          size={56}
          className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xl"
        >
          {name[0]}
        </Avatar>
        <div>
          <div className="font-black text-gray-900 text-lg">{name}</div>
          <div className="text-sm text-gray-500 font-semibold">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}
