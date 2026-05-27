import { Link } from 'react-router-dom';
import { Users, Eye, FileText, Award, ArrowRight } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import SEO from '../components/seo/SEO';

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
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SEO 
        title="About Us"
        description="Meet the team behind Gridaan, sharing tech guides, AI articles, and engineering tutorials."
      />
      <PageHero
        title="About Gridaan"
        description="A team of technologists and writers covering AI, engineering, and the ideas shaping tomorrow."
      />

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: 'Articles Published', value: '450+' },
            { icon: Users, label: 'Subscribers', value: '24K+' },
            { icon: Eye, label: 'Monthly Views', value: '1.2M+' },
            { icon: Award, label: 'Expert Writers', value: '15+' },
          ].map(stat => (
            <div key={stat.label} className="bg-card rounded-2xl p-6 text-center shadow-xs border border-border">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-text">{stat.value}</div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-text mb-4">Our Mission</h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-3xl mx-auto">
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
            <div key={v.title} className="bg-card rounded-2xl p-6 text-center border border-border">
              <span className="text-3xl mb-3 block">{v.emoji}</span>
              <h3 className="text-sm font-bold text-text mb-2">{v.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 className="text-2xl font-bold text-text mb-8 text-center">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {teamMembers.map(author => (
            <div key={author.id} className="bg-card rounded-2xl p-6 text-center border border-border hover:shadow-md transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mx-auto mb-4 border border-primary/20">
                {author.name.charAt(0)}
              </div>
              <h3 className="font-bold text-sm text-text">{author.name}</h3>
              <p className="text-xs text-primary font-bold mb-2">{author.role}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{author.bio}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xs">
          <h2 className="text-xl md:text-2xl font-bold mb-3">Want to write for us?</h2>
          <p className="text-blue-100 text-xs mb-6 max-w-xl mx-auto leading-relaxed">
            We're always looking for talented writers and experts to join our team. Share your knowledge with our growing community of tech leaders.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-white text-primary hover:bg-blue-50 rounded-full text-xs font-bold transition-all hover:-translate-y-0.5 cursor-pointer">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
