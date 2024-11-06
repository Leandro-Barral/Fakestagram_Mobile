import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RegisterModal from '@/components/register/Modal';

const RegisterPage = () => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (location.state?.openModal) {
            setIsModalOpen(true);
        }
    }, [location.state]);

    return (
        <view>
            <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </view>
    );
};
 
export default RegisterPage;
