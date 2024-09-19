import React, { ReactNode } from 'react';
import '../styles/popup.css'; 

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
  }
  
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          {children}
          <button className="modal-close-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    );
  };
  
  export default Modal;
