import { Link } from 'react-router-dom';
import { Users, Eye, FileText, Award, ArrowRight } from 'lucide-react';
import { authors } from '../data/mockData';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-linear-to-br from-[#060A16] via-[#0A1222] to-[#0B1224] text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            About <span className="bg-linear-to-r from-[#327CFA] to-[#003CC6] bg-clip-text text-transparent">Gridaan</span>
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            We're a team of passionate technologists, writers, and creators dedicated to bringing you the best content from the world of technology, AI, programming, and digital innovation.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: 'Articles Published', value: '342+' },
            { icon: Users, label: 'Subscribers', value: '24K+' },
            { icon: Eye, label: 'Monthly Views', value: '1.2M+' },
            { icon: Award, label: 'Expert Writers', value: '15+' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0B1224] dark:bg-[#0B1224] rounded-2xl p-6 text-center shadow-xl border border-[#1E293B]/50 dark:border-[#1E293B]/50">
              <stat.icon className="w-6 h-6 text-[#327CFA] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#F8FAFC] dark:text-white">{stat.value}</div>
              <div className="text-xs text-[#94A3B8]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F8FAFC] dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-[#94A3B8] text-lg leading-relaxed max-w-3xl mx-auto">
            At Gridaan, we believe technology knowledge should be accessible to everyone. Our mission is to create high-quality, informative, and engaging content that helps developers, tech enthusiasts, and business leaders stay ahead of the rapidly evolving digital landscape.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { emoji: '🎯', title: 'Quality First', desc: 'Every article is researched, reviewed, and crafted to deliver maximum value.' },
            { emoji: '🌍', title: 'Accessible', desc: 'Free, open, and available to developers and tech enthusiasts worldwide.' },
            { emoji: '⚡', title: 'Cutting Edge', desc: 'We cover the latest trends, tools, and technologies as they emerge.' },
          ].map(v => (
            <div key={v.title} className="bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-2xl p-8 text-center border border-[#1E293B]/50 dark:border-[#1E293B]/50">
              <span className="text-4xl mb-4 block">{v.emoji}</span>
              <h3 className="text-lg font-bold text-[#F8FAFC] dark:text-white mb-2">{v.title}</h3>
              <p className="text-sm text-gray-600 dark:text-[#94A3B8]">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 className="text-3xl font-bold text-[#F8FAFC] dark:text-white mb-8 text-center">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {authors.map(author => (
            <div key={author.id} className="bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-2xl p-6 text-center border border-[#1E293B]/50 dark:border-[#1E293B]/50 hover:shadow-lg transition-all">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#327CFA] to-[#003CC6] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {author.name.charAt(0)}
              </div>
              <h3 className="font-bold text-[#F8FAFC] dark:text-white">{author.name}</h3>
              <p className="text-sm text-[#327CFA] dark:text-[#94A3B8] mb-2">{author.role}</p>
              <p className="text-sm text-[#94A3B8] dark:text-[#94A3B8]">{author.bio}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-linear-to-r from-[#327CFA] to-[#003CC6] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to write for us?</h2>
          <p className="text-[#94A3B8] mb-6 max-w-xl mx-auto">
            We're always looking for talented writers and experts to join our team. Share your knowledge with our growing community.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-[#0B1224] text-[#327CFA] rounded-xl font-semibold hover:bg-[#0B1224] transition-all">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
