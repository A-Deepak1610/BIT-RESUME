import React from 'react'
import A4Page from './A4Page'
import logo from '../../assets/logo_bit.jpg'
import { Phone, Mail, Linkedin, Github, MapPin } from "lucide-react"
import ProjectsForResume from './projects/ProjectsForResume'
import PsDataForResume from './PsDataForResume'
import MentorMenteeForResume from './MentorMenteeForResume'
import AreasOfExpertise from './AreasOfExpertise'
import AccomplishmentsForResume from './AccomplishmentsForResume'
import ActivenessGraphForResume from '../dashboard/graphs/graph1/ActivenessGraphForResume'
import AchievementsGraphForResume from '../dashboard/graphs/grpah2/AchievementsGraphForResume'
// A helper component to create consistent section styling                                     
const Section = ({ title, children, className }) => (
  <section className={className}>
    <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4">
      {title}
    </h2>
    {children}
  </section>
);

export default function MyResume() {
  return (
    <>
      <A4Page>
        <header className="flex items-center w-full mb-5">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800">Selva</h1>
            <p className="text-lg font-medium text-blue-800">Computer Science & Engineering Student</p>
            
            <div className="flex items-center text-xs text-gray-600 mt-2 space-x-4">
              <div className="flex items-center"><Mail size={12} className="mr-1.5" /><span>email@gmail.com</span></div>
              <div className="flex items-center"><Phone size={12} className="mr-1.5" /><span>+91 6380899737</span></div>
              <div className="flex items-center"><MapPin size={12} className="mr-1.5" /><span>Erode, Tamil Nadu</span></div>
            </div>
            <div className="flex items-center text-xs text-gray-600 mt-1.5 space-x-4">
              <a href="https://github.com/selva" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600"><Github size={12} className="mr-1.5" /><span>github.com/selva</span></a>
              <a href="https://linkedin.com/in/selva" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600"><Linkedin size={12} className="mr-1.5" /><span>linkedin.com/in/selva</span></a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="profile"
              className="rounded-full w-24 h-24 object-cover border-2 border-gray-300"
            />
          </div>
        </header>

        <Section title="Education">
          <div className="flex justify-between items-start text-sm">
            <div>
              <p className="font-semibold text-gray-800">Bannari Amman Institute of Technology</p>
              <p className="text-gray-600">Bachelor of Engineering - Computer Science</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">2024 - 2028</p>
              <p className="text-gray-600">CGPA: 8.5 / 10.0</p>
            </div>
          </div>
        </Section>

        {/* --- MAIN CONTENT (SINGLE COLUMN LAYOUT) --- */}
        <div className="mt-4 space-y-5">
          <Section title="Areas of Expertise">
            <AreasOfExpertise />
          </Section>
          
          <Section title="Projects">
            <ProjectsForResume />
          </Section>

          <Section title="Accomplishments">
            <AccomplishmentsForResume />
          </Section>
          
          <Section title="personal Skill">
            <PsDataForResume />
          </Section>

          <Section title="Leadership & Mentorship">
            <MentorMenteeForResume />
          </Section>
        </div>
      </A4Page>

      {/* --- SECOND PAGE FOR VISUALIZATIONS --- */}
      <A4Page>
        <div className="space-y-8">
            <ActivenessGraphForResume/>
            <AchievementsGraphForResume/>
        </div>
      </A4Page>
    </>
  )
}