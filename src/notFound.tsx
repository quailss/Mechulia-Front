import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 메인 페이지로 리다이렉트
        navigate('/', { replace: true });
    }, [navigate]);

    return null; // UI를 렌더링하지 않고 바로 리다이렉트
};

export default NotFound;
