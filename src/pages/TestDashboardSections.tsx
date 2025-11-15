import { useState } from 'react';
import { MindfulnessGames } from '@/components/games/MindfulnessGames';
import { RelaxationHub } from '@/components/music/RelaxationHub';
import { PeerEngagement } from '@/components/social/PeerEngagement';
import KhushMehtabAdda from '@/components/social/KhushMehtabAdda';
import { VRWellnessHub } from '@/components/vr/VRWellnessHub';

const TestDashboardSections = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'vr' | 'games' | 'music' | 'social'>('overview');

  const sections = [
    { id: 'games', title: 'Mindful Games', component: <MindfulnessGames /> },
    { id: 'music', title: 'Relaxation Hub', component: <RelaxationHub /> },
    { id: 'social', title: 'Social Hub', component: <><PeerEngagement /><KhushMehtabAdda /></> },
    { id: 'vr', title: 'VR Wellness Hub', component: <VRWellnessHub /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Dashboard Sections</h1>
        
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
              >
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="text-gray-600">Click to test this section</p>
              </button>
            ))}
          </div>
        )}

        {activeSection !== 'overview' && (
          <div>
            <button
              onClick={() => setActiveSection('overview')}
              className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ← Back to Overview
            </button>
            
            <div className="bg-white rounded-lg shadow p-6">
              {sections.find(s => s.id === activeSection)?.component}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDashboardSections;