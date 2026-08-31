'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const breadcrumbs = [
    { name: 'Contact Us' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl grid lg:grid-cols-12 gap-8">
        
        {/* Left Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Contact Our Team</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Have a question about a career roadmap, data correction, or partnership? Drop us a line.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-3 p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <Mail className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Direct Email</span>
                <strong className="text-white">dkmadan2k@gmail.com</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Headquarters</span>
                <strong className="text-white">India • Remote</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Message Received!</h3>
              <p className="text-xs text-slate-300">Thank you for reaching out. We will get back to you within 24 to 48 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Your Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Message / Inquiry</label>
                <textarea 
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist your skilling journey?"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-glow-btn flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
