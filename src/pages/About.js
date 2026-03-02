import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', title: 'Expert Instructors', desc: 'Learn from industry professionals with years of experience' },
    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Flexible Learning', desc: 'Study at your own pace with lifetime access to courses' },
    { icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Learn Anywhere', desc: 'Access courses on any device, anytime, anywhere' },
    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Track Progress', desc: 'Monitor your learning journey with detailed analytics' },
  ];

  const stats = [
    { value: '10K+', label: 'Active Students' },
    { value: '500+', label: 'Courses' },
    { value: '100+', label: 'Instructors' },
    { value: '98%', label: 'Satisfaction' },
  ];

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', 
        padding: '80px 0' 
      }}>
        <div className="container text-center">
          <h1 style={{ color: 'white', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 800 }}>About Learnix</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
            Empowering learners worldwide with quality education and expert instruction
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '3rem 0', background: 'white' }}>
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div className="col-6 col-md-3 text-center" key={index}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#22d3ee' }}>{stat.value}</div>
                <div style={{ color: '#64748b' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=400&fit=crop"
                alt="About Learnix"
                style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              />
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <h2 style={{ color: '#0f172a', marginBottom: '1.5rem', fontWeight: 700 }}>Our Mission</h2>
              <p style={{ lineHeight: 1.8, color: '#64748b', marginBottom: '1.5rem' }}>
                We believe that education should be accessible to everyone, everywhere. Our mission is to democratize learning by connecting passionate instructors with eager learners from around the world.
              </p>
              <p style={{ lineHeight: 1.8, color: '#64748b' }}>
                Through our platform, we aim to break down barriers to education and provide high-quality courses that help people achieve their personal and professional goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ color: '#0f172a', marginBottom: '1rem', fontWeight: 700 }}>Why Choose Learnix?</h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              We provide the best learning experience with features designed to help you succeed
            </p>
          </div>
          
          <div className="row g-4">
            {features.map((feature, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div style={{
                  background: '#f8fafc',
                  padding: '30px 20px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  height: '100%',
                  transition: 'all 0.3s'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={feature.icon}></path>
                    </svg>
                  </div>
                  <h5 style={{ color: '#0f172a', marginBottom: '0.75rem', fontWeight: 700 }}>{feature.title}</h5>
                  <p style={{ color: '#64748b', marginBottom: 0 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', 
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '1rem', fontWeight: 700 }}>Ready to Start Your Journey?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join thousands of learners who are already advancing their careers with Learnix
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link 
              to="/register" 
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                color: '#0f172a',
                padding: '14px 32px',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: 700
              }}
            >
              Get Started
            </Link>
            <Link 
              to="/courses" 
              style={{
                background: 'transparent',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '30px',
                border: '2px solid white',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a1628', padding: '40px 0', color: 'white' }}>
        <div className="container">
          <div className="text-center">
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>© 2024 Learnix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
