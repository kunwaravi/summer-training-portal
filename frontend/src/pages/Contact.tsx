import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building, Mail, Phone, Clock, Globe, Send } from 'lucide-react';
import { useUI } from '../context/UIContext';
import api from '../api';

const Contact = () => {
  const { addToast } = useUI();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    COMPANY_NAME: 'EduNexus Pro',
    WEBSITE_URL: 'https://edunexus.kibm.in',
    CONTACT_EMAIL: 'edunexuspro@gmail.com',
    CONTACT_PHONE: '+91 99999 99999',
    CONTACT_HOURS: 'Monday to Saturday | 10:00 AM – 6:00 PM (IST)'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/contact/settings');
        setSettings(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error('Failed to load contact settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/contact', formData);
      addToast('Thank you! Your message has been received. Our team will contact you shortly.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('Failed to send message:', err);
      addToast(err.response?.data?.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SECURITY: WEBSITE_URL is admin-editable — only render it as a link if it
  // is actually an http(s) URL (a `javascript:` value would execute on click).
  const rawWebsiteUrl = settings.WEBSITE_URL?.trim();
  const safeWebsiteUrl = rawWebsiteUrl && /^https?:\/\//i.test(rawWebsiteUrl) ? rawWebsiteUrl : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/20 selection:text-indigo-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/30 border border-indigo-900/40 px-2.5 py-0.5 rounded-full">
            Contact Desk
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Get in <span className="text-indigo-400">Touch</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-wider">
            Have questions? We are here to help you guide through your industrial training journey.
          </p>
        </div>

        {/* Form and Info Container */}
        <div className="grid gap-8 md:grid-cols-5">
          
          {/* Contact Details Card (2/5 width) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-6 space-y-6 backdrop-blur-sm relative overflow-hidden h-full flex flex-col justify-between">
              
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-3">
                  Company Info
                </h2>

                {/* Company Name */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 text-indigo-400 rounded-xl mt-1">
                    <Building size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company</h3>
                    <p className="text-sm font-semibold text-slate-200">{settings.COMPANY_NAME}</p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 text-indigo-400 rounded-xl mt-1">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website</h3>
                    {safeWebsiteUrl ? (
                      <a href={safeWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-450 hover:underline break-all">
                        {safeWebsiteUrl.replace('https://', '').replace('http://', '')}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold text-slate-400 break-all">{rawWebsiteUrl || '—'}</span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 text-indigo-400 rounded-xl mt-1">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</h3>
                    <a href={`mailto:${settings.CONTACT_EMAIL}`} className="text-sm font-semibold text-slate-200 hover:text-indigo-400 break-all">
                      {settings.CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 text-indigo-400 rounded-xl mt-1">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Number</h3>
                    <p className="text-sm font-semibold text-slate-250 select-all">{settings.CONTACT_PHONE}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 text-indigo-400 rounded-xl mt-1">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Hours</h3>
                    <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                      {settings.CONTACT_HOURS}
                    </p>
                  </div>
                </div>
              </div>

              {/* Support channels */}
              <div className="pt-6 border-t border-slate-900 text-center">
                <p className="text-[11px] text-slate-550 font-bold uppercase tracking-wider">Instant Help Channels</p>
                <div className="flex justify-center gap-4 mt-3">
                  <a href="https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar?s=cl&p=a&mlu=1" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-450 hover:underline">
                    WhatsApp
                  </a>
                  <span className="text-slate-800">•</span>
                  <a href="https://t.me/+tCapxtLwxNNlZjY1" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-405 hover:underline">
                    Telegram
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Form Card (3/5 width) */}
          <div className="md:col-span-3">
            <div className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-3 mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-450">Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-450">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@college.edu"
                      className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-450">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Course enrollment, Certificate issue"
                    className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-450">Message *</label>
                  <textarea 
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98]"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      Send Message <Send size={14} />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
