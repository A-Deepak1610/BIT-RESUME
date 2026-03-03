import React, { useState } from 'react';
import {
  User, Mail, Phone, Calendar, Briefcase, Award,
  BookOpen, Users, Activity, FileText, CheckCircle2,
  TrendingUp, Award as AwardIcon, Lightbulb, Target
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  CartesianAxis
} from 'recharts';

// --- MOCK DATA ---
const facultyProfile = {
  id: "10775",
  name: "Mrs. MYTHILI S",
  designation: "Assistant Professor Level III",
  department: "ELECTRONICS AND COMMUNICATION ENGINEERING",
  doj: "30-05-2020",
  email: "mythiliss@bitsathy.ac.in",
  mobile: "9095702682",
  team: "PERSONALISED SKILL IQAC - FACULTY ACTIVITIES",
  phdStatus: "Registration Completed",
  image: "https://ui-avatars.com/api/?name=Mythili+S&background=F3E8FF&color=6B21A8&size=150" // Placeholder for profile image
};

const achievementStats = [
  { label: "Journal Publication", value: 10, color: "bg-fuchsia-100 text-fuchsia-700" },
  { label: "Patent", value: 2, color: "bg-orange-100 text-orange-700" },
  { label: "Proposal Sanctioned", value: 0, color: "bg-blue-100 text-blue-700" },
  { label: "Consultancies", value: 0, color: "bg-emerald-100 text-emerald-700" },
  { label: "Board of Studies", value: 1, color: "bg-teal-100 text-teal-700" },
  { label: "E-Content Developed", value: 2, color: "bg-indigo-100 text-indigo-700" },
  { label: "Event Organized", value: 7, color: "bg-pink-100 text-pink-700" },
  { label: "Events Attended", value: 15, color: "bg-amber-100 text-amber-700" },
  { label: "External Visits", value: 0, color: "bg-cyan-100 text-cyan-700" },
  { label: "Notable Achievements", value: 0, color: "bg-red-100 text-red-700" },
  { label: "Online Course", value: 6, color: "bg-sky-100 text-sky-700" },
  { label: "Paper Presentation", value: 16, color: "bg-lime-100 text-lime-700" },
  { label: "International Visit", value: 0, color: "bg-rose-100 text-rose-700" },
  { label: "External Examiners", value: 6, color: "bg-violet-100 text-violet-700" },
  { label: "Guest Lecture", value: 0, color: "bg-yellow-100 text-yellow-700" },
  { label: "Professional Body", value: 1, color: "bg-green-100 text-green-700" },
  { label: "Book Chapter", value: 0, color: "bg-slate-100 text-slate-700" },
  { label: "Journal Reviewer", value: 0, color: "bg-stone-100 text-stone-700" },
];

const pieData = achievementStats.filter(stat => stat.value > 0).map(stat => ({
  name: stat.label,
  value: stat.value
})).sort((a, b) => b.value - a.value);

const COLORS = ['#F97316', '#3B82F6', '#6366F1', '#8B5CF6', '#10B981', '#F43F5E', '#EAB308'];

const fapTargets = [
  { label: "JOURNAL PUBLICATION (WoS/SCI)", target: 1, attained: 2, bg: "bg-gradient-to-br from-rose-400 to-rose-500", text: "text-white" },
  { label: "JOURNAL PUBLICATION (Scopus)", target: 2, attained: 2, bg: "bg-gradient-to-br from-cyan-400 to-cyan-500", text: "text-white" },
  { label: "CONSULTANCIES", target: "-", attained: 0, bg: "bg-white border border-gray-100 shadow-sm", text: "text-gray-800" },
  { label: "PATENT FILED", target: 1, attained: 0, bg: "bg-pink-100/50 border border-pink-100", text: "text-pink-900" },
  { label: "FUNDING PROPOSAL", target: "-", attained: 0, bg: "bg-yellow-50 border border-yellow-100", text: "text-yellow-900" },
  { label: "ONLINE COURSES", target: 2, attained: 0, bg: "bg-gradient-to-br from-orange-400 to-orange-500", text: "text-white" },
];

const yearlyAttainmentData = [
  { year: '2021-2022', target: 2, attained: 2 },
  { year: '2022-2023', target: 3, attained: 2 },
  { year: '2023-2024', target: 5, attained: 2 },
  { year: '2024-2025', target: 7, attained: 4 },
  { year: '2025-2026', target: 9, attained: 4 },
];

// --- COMPONENTS ---

const ProfileDetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50/50 transition-colors">
    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
      <Icon size={16} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-semibold truncate" title={value}>{value}</p>
    </div>
  </div>
);

const AchievementCard = ({ stat }) => (
  <div className={`relative flex flex-col justify-center items-center p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-default border border-transparent hover:border-black/5 ${stat.color}`}>
    <span className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-2 text-center leading-tight h-8 flex items-center">{stat.label}</span>
    <span className="text-4xl font-black tracking-tighter">{stat.value}</span>
  </div>
);

const FapTargetCard = ({ data }) => {
  const isLight = data.bg.includes('bg-white') || data.bg.includes('50') || data.bg.includes('100');
  return (
    <div className={`rounded-2xl p-4 flex flex-col justify-between ${data.bg} ${!isLight ? 'shadow-lg shadow-' + data.bg.split('-')[2] + '-500/30' : ''}`}>
      <h4 className={`text-[10px] font-bold tracking-wider mb-4 ${data.text} opacity-90 text-center uppercase`}>
        {data.label}
      </h4>
      <div className="flex items-center justify-around mt-auto">
        <div className="text-center">
          <p className={`text-xs mb-1 ${data.text} opacity-80 uppercase tracking-wide`}>Target</p>
          <p className={`text-3xl font-black ${data.text}`}>{data.target}</p>
        </div>
        <div className={`w-px h-8 ${isLight ? 'bg-black/10' : 'bg-white/20'}`}></div>
        <div className="text-center">
          <p className={`text-xs mb-1 ${data.text} opacity-80 uppercase tracking-wide`}>Attained</p>
          <p className={`text-3xl font-black ${data.text}`}>{data.attained}</p>
        </div>
      </div>
    </div>
  );
};

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6 lg:p-8 font-sans selection:bg-indigo-500 selection:text-white">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-indigo-600">
            <Activity size={16} />
            <span>Faculty Portal</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-500 mt-1 max-w-xl text-sm leading-relaxed">
            Overview of your academic activities, targets, and recent achievements for the academic year.
          </p>
        </div>

        {/* Simple Tabs */}
        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-100 inline-flex">
          {['overview', 'achievements', 'targets'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all duration-200 ${activeTab === tab
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* PROFILE SECTION */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col xl:flex-row gap-8 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

          {/* Left: Bio & Image */}
          <div className="flex flex-col md:flex-row gap-6 items-center xl:items-start xl:w-1/3 shrink-0">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300 -z-10 opacity-20"></div>
              <img
                src={facultyProfile.image}
                alt={facultyProfile.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-3 tracking-wide">
                ID: {facultyProfile.id}
              </span>
              <h2 className="text-2xl font-black text-gray-900 mb-1">{facultyProfile.name}</h2>
              <p className="text-sm font-semibold text-gray-600 mb-1">{facultyProfile.designation}</p>
              <p className="text-xs text-gray-500 max-w-[250px]">{facultyProfile.department}</p>
            </div>
          </div>

          {/* Right: Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:w-2/3">
            <ProfileDetailItem icon={Mail} label="Official Mail Id" value={facultyProfile.email} />
            <ProfileDetailItem icon={Phone} label="Mobile No" value={facultyProfile.mobile} />
            <ProfileDetailItem icon={Calendar} label="Date of Joining" value={facultyProfile.doj} />

            {/* Span 2 cols for Team */}
            <div className="sm:col-span-2 lg:col-span-2 bg-gradient-to-r from-fuchsia-50 to-pink-50 p-4 rounded-xl border border-pink-100/50 flex flex-col justify-center">
              <p className="text-xs text-fuchsia-600 font-bold uppercase tracking-wider mb-1">Team</p>
              <p className="text-sm font-semibold text-gray-800">{facultyProfile.team}</p>
            </div>

            {/* Phd Status */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-100/50 flex flex-col justify-center items-center text-center">
              <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Ph.D. Status</p>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                <CheckCircle2 size={16} className="text-amber-500" />
                <span>{facultyProfile.phdStatus}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS SUMMARY */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievement Cards Grid */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <AwardIcon className="text-indigo-500" />
                Faculty Achievements
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {achievementStats.map((stat, i) => (
                <AchievementCard key={i} stat={stat} />
              ))}
            </div>
          </div>

          {/* Over All Count Pie Chart */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-6">
              <PieChart className="text-emerald-500" />
              Overall Distribution
            </h3>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="w-full mt-4 space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-gray-600 truncate">{entry.name}</span>
                    </div>
                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PERFORMANCE FAP TARGETS */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">

          <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Target className="text-rose-500" />
                FAP Indicator
              </h3>
              <p className="text-sm font-medium text-rose-500 mt-1">
                AP II Journal Target : 1 WoS/SCI or 2 Scopus. Achieving either fulfills the requirement.
              </p>
            </div>

            {/* FAP Score Highlight Card */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-500/20 text-white min-w-[120px] text-center">
                <p className="text-[10px] font-bold tracking-wider uppercase opacity-80 mb-1">Total Target</p>
                <p className="text-3xl font-black">6</p>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-4 rounded-2xl shadow-lg shadow-amber-500/20 text-white min-w-[120px] text-center">
                <p className="text-[10px] font-bold tracking-wider uppercase opacity-80 mb-1">Attained</p>
                <p className="text-3xl font-black">4</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20 text-white min-w-[160px] text-center">
                <p className="text-[10px] font-bold tracking-wider uppercase opacity-80 mb-1">FAP Score (Out of 1)</p>
                <p className="text-3xl font-black">0.667</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
            {fapTargets.map((data, i) => (
              <FapTargetCard key={i} data={data} />
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 text-center">Academic Year-wise Attainment Status</h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearlyAttainmentData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <RechartsTooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="target" name="Total Target" fill="#4ADE80" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="attained" name="Attained" fill="#FBBF24" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="fapScore" name="FAP Score" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Added custom CSS for scrollbar locally */}
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #E5E7EB;
                border-radius: 4px;
              }
              .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                background: #D1D5DB;
              }
            `}</style>
          </div>
        </section>

      </div>
    </div>
  );
}
