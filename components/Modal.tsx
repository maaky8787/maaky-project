
import React, { ReactNode } from 'react';

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-7xl" onClick={(e) => e.stopPropagation()}>

                {children}
            </div>
        </div>
    );
};

export default Modal;