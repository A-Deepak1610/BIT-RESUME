import React, { useState } from 'react';
import { Award, Briefcase, ShieldCheck } from 'lucide-react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Certifications from './certifications/Certifications';
import InternshipExperience from './InternshipExperience/internshipExperience';
import Hackathons from './hackathons/Hackathons';

// Style object for the MUI Modal content
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '50%', lg: '33%' }, // Responsive width
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  outline: 'none', // Remove the default focus outline
};

export default function Accomplishments() {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case 'certifications':
        return <Certifications />;
      case 'hackathons':
        return <Hackathons />;
      case 'internships':
        return <InternshipExperience />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalContent) {
      case 'certifications':
        return 'Professional Certifications';
      case 'hackathons':
        return 'Hackathon Wins';
      case 'internships':
        return 'Internship Experience';
      default:
        return '';
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg h-full flex flex-col">
      <h3 className="text-md font-semibold text-gray-700 mb-4 flex-shrink-0">
        My Accomplishments
      </h3>
      <div className="flex-grow space-y-3">
        {/* Professional Certification */}
        <div
          className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => openModal('certifications')}
        >
          <ShieldCheck className="text-[#7371ff]" />
          <span className="ml-2 font-semibold text-gray-800">
            Professional Certification
          </span>
        </div>

        {/* Hackathon Wins */}
        <div
          className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => openModal('hackathons')}
        >
          <Award className="text-[#7371ff]" />
          <span className="ml-2 font-semibold text-gray-800">Hackathon Wins</span>
        </div>

        {/* Internship Experience */}
        <div
          className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => openModal('internships')}
        >
          <Briefcase className="text-gray-500" />
          <span className="ml-2 font-semibold text-gray-800">
            Internship Experience
          </span>
        </div>
      </div>

      <Modal
        open={!!modalContent}
        onClose={closeModal}
        aria-labelledby="accomplishment-modal-title"
      >
        <Box sx={modalStyle}>
          {/* Modal Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <Typography id="accomplishment-modal-title" className="text-lg font-semibold">
              {getModalTitle()}
            </Typography>
            <IconButton onClick={closeModal} size="small">
              <CloseIcon />
            </IconButton>
          </div>
          
          {/* Modal Body */}
          <div className="p-4">
            {renderModalContent()}
          </div>
        </Box>
      </Modal>
    </div>
  );
}