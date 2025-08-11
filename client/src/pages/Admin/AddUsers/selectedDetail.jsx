import React from 'react';
import { User, GraduationCap, Mail, Phone, MapPin, Calendar, Award, BookOpen, Star, Clock, Building } from 'lucide-react';

export default function SelectedDetail({ selectedUser, userType }) {
  if (!selectedUser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 h-fit">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            {userType === 'mentor' ? <User size={64} /> : <GraduationCap size={64} />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {userType} Selected
          </h3>
          <p className="text-gray-500 text-sm">
            Click on a {userType} card to view their details
          </p>
        </div>
      </div>
    );
  }

  const DetailItem = ({ icon: Icon, label, value, color = "text-gray-600" }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0 w-5 h-5 mt-0.5">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className={`text-sm ${color} break-words`}>{value}</p>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
      status === 'Active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'Active' ? 'bg-green-400' : 'bg-red-400'
      }`}></div>
      {status}
    </span>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
      {/* Header */}
      <div className="text-center mb-6 pb-6 border-b border-gray-200">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {userType === 'mentor' ? (
            <User className="text-blue-600" size={32} />
          ) : (
            <GraduationCap className="text-green-600" size={32} />
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedUser.name}</h2>
        <p className="text-gray-600 mb-3">{selectedUser.email}</p>
        <StatusBadge status={selectedUser.status} />
      </div>

      {/* Details */}
      <div className="space-y-1">
        {userType === 'student' && (
          <>
            <DetailItem 
              icon={Award} 
              label="Roll Number" 
              value={selectedUser.rollno} 
              color="text-blue-600"
            />
            <DetailItem 
              icon={Calendar} 
              label="Year" 
              value={selectedUser.year} 
            />
            <DetailItem 
              icon={Star} 
              label="CGPA" 
              value={selectedUser.cgpa} 
              color="text-yellow-600"
            />
          </>
        )}

        {userType === 'mentor' && (
          <>
            <DetailItem 
              icon={Clock} 
              label="Experience" 
              value={selectedUser.experience} 
              color="text-purple-600"
            />
            <DetailItem 
              icon={BookOpen} 
              label="Specialization" 
              value={selectedUser.specialization} 
              color="text-indigo-600"
            />
          </>
        )}

        <DetailItem 
          icon={Building} 
          label="Department" 
          value={selectedUser.department} 
        />
        <DetailItem 
          icon={Award} 
          label="Type" 
          value={selectedUser.type} 
        />
        <DetailItem 
          icon={Phone} 
          label="Phone" 
          value={selectedUser.phone} 
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <button className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
          <Mail size={16} />
          <span>Send Email</span>
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gray-100 text-gray-700 py-2.5 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
            <User size={16} />
            <span>Edit</span>
          </button>
          <button className="bg-red-100 text-red-700 py-2.5 px-4 rounded-md text-sm font-medium hover:bg-red-200 transition-colors duration-200 flex items-center justify-center space-x-2">
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {userType === 'mentor' ? '15' : '8.5'}
            </p>
            <p className="text-xs text-gray-600">
              {userType === 'mentor' ? 'Students' : 'CGPA'}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {userType === 'mentor' ? '95%' : '85%'}
            </p>
            <p className="text-xs text-gray-600">
              {userType === 'mentor' ? 'Success Rate' : 'Attendance'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}