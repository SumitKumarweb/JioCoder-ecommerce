'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

const quickHelpItems = [
  {
    id: 'tracking',
    icon: 'local_shipping',
    title: 'Order Tracking',
    description: 'Track your package in real-time and view delivery updates.',
  },
  {
    id: 'payments',
    icon: 'payments',
    title: 'Payments',
    description: 'Manage payment methods, invoices, and billing issues.',
  },
  {
    id: 'returns',
    icon: 'assignment_return',
    title: 'Returns & Refunds',
    description: 'Easy returns process and instant refund status updates.',
  },
  {
    id: 'technical',
    icon: 'build',
    title: 'Technical Support',
    description: 'Troubleshoot your devices with our expert technical guides.',
  },
  {
    id: 'warranty',
    icon: 'verified_user',
    title: 'Warranty',
    description: 'Check warranty status and file claims for your products.',
  },
  {
    id: 'security',
    icon: 'lock',
    title: 'Account Security',
    description: 'Secure your profile and update personal security settings.',
  },
];

const faqItems = [
  {
    question: 'What is the return window for high-end electronics?',
    href: '#',
  },
  {
    question: 'How do I track my international shipment?',
    href: '#',
  },
  {
    question: 'Are there any installation charges for appliances?',
    href: '#',
  },
  {
    question: 'Can I change my delivery address after shipping?',
    href: '#',
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Support' },
          ]}
        />

        {/* Hero Section */}
        <section className="text-center mb-16 mt-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">How can we help you?</h1>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="block w-full pl-12 pr-32 py-4 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary text-lg placeholder:text-slate-400 transition-all"
              placeholder="Search for orders, returns, or technical issues..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 inset-y-0 flex items-center">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>
          <p className="mt-4 text-slate-500 text-sm">
            Common:{' '}
            <Link href="#track-refund" className="underline cursor-pointer hover:text-primary">
              Track Refund
            </Link>
            ,{' '}
            <Link href="#warranty" className="underline cursor-pointer hover:text-primary">
              Warranty Claim
            </Link>
            ,{' '}
            <Link href="#payment" className="underline cursor-pointer hover:text-primary">
              Payment Failed
            </Link>
          </p>
        </section>

        {/* Quick Help Grid */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Quick Help</h2>
            <Link
              href="/support/topics"
              className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all topics
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickHelpItems.map((item) => (
              <Link
                key={item.id}
                href={`/support/${item.id}`}
                className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-primary transition-all cursor-pointer hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact Support Section */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Contact Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Chat */}
            <div className="flex flex-col items-center p-8 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-primary">chat</span>
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-100 rounded-full animate-pulse"></span>
              </div>
              <h3 className="text-xl font-bold mb-1">Live Chat</h3>
              <p className="text-slate-500 text-sm mb-6">Chat with our experts for immediate assistance.</p>
              <div className="mt-auto w-full">
                <p className="text-emerald-500 text-xs font-bold mb-4 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  Typically responds in 2 mins
                </p>
                <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-all">
                  Start Chat
                </button>
              </div>
            </div>

            {/* Email Support */}
            <div className="flex flex-col items-center p-8 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-primary">mail</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">Email Support</h3>
              <p className="text-slate-500 text-sm mb-6">Reach out via support@jiocoder.in</p>
              <div className="mt-auto w-full">
                <p className="text-slate-500 text-xs font-medium mb-4">Estimated response: 2-4 hours</p>
                <a
                  href="mailto:support@jiocoder.in"
                  className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all block text-center"
                >
                  Send Email
                </a>
              </div>
            </div>

            {/* Call Support */}
            <div className="flex flex-col items-center p-8 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-primary">call</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">Request a Call</h3>
              <p className="text-slate-500 text-sm mb-6">Tell us your issue and we'll call you back.</p>
              <div className="mt-auto w-full">
                <p className="text-slate-500 text-xs font-medium mb-4">Available 9 AM - 9 PM IST</p>
                <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all">
                  Call Me Back
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Quick Links */}
        <section className="mt-20 pt-10 border-t border-slate-200">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {faqItems.map((faq, index) => (
              <Link
                key={index}
                href={faq.href}
                className="flex items-center justify-between py-3 border-b border-slate-100 hover:text-primary transition-colors"
              >
                <span className="text-sm">{faq.question}</span>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

