import { Link } from 'react-router-dom';
import { Users, Eye, FileText, Award, ArrowRight } from 'lucide-react';
import PageHero from '../components/layout/PageHero';

const teamMembers = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    bio: 'Senior tech editor covering AI, cloud computing, and emerging technologies.',
    role: 'Senior Editor',
  },
  {
    id: 'marcus-johnson',
    name: 'Marcus Johnson',
    bio: 'Full-stack developer and tech writer specializing in web technologies and DevOps.',
    role: 'Tech Writer',
  },
  {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    bio: 'Data scientist and AI researcher sharing practical machine learning insights.',
    role: 'AI Correspondent',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="About Gridaan"
        description="A team of technologists and writers covering AI, engineering, and the ideas shaping tomorrow."
      />

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
              <stat.icon className="w-6 h-6 text-[#2563EB] mx-auto mb-2" />
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
          {teamMembers.map(author => (
            <div key={author.id} className="bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-2xl p-6 text-center border border-[#1E293B]/50 dark:border-[#1E293B]/50 hover:shadow-lg transition-all">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {author.name.charAt(0)}
              </div>
              <h3 className="font-bold text-[#F8FAFC] dark:text-white">{author.name}</h3>
              <p className="text-sm text-[#2563EB] dark:text-[#94A3B8] mb-2">{author.role}</p>
              <p className="text-sm text-[#94A3B8] dark:text-[#94A3B8]">{author.bio}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-linear-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to write for us?</h2>
          <p className="text-[#94A3B8] mb-6 max-w-xl mx-auto">
            We're always looking for talented writers and experts to join our team. Share your knowledge with our growing community.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-[#0B1224] text-[#2563EB] rounded-xl font-semibold hover:bg-[#0B1224] transition-all">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
