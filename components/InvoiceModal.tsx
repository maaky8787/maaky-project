import React, { ReactNode } from 'react';
import Modal from './Modal';

interface InvoiceModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ title, onClose, children }) => {
    return (
        <Modal onClose={onClose}>
            <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">{title}</h2>
                {children}
            </div>
            <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                    إغلاق
                </button>
            </div>
        </Modal>
    );
};

export default InvoiceModal;
