import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState({
        username: 'John Doe',
        email: 'john.doe@example.com',
        phone: '09123456789',
        profileImage: null, // Default to null
    });

    const updateUserProfile = (newProfileData) => {
        setUserProfile(prevProfile => ({ ...prevProfile, ...newProfileData }));
    };

    return (
        <UserContext.Provider value={{ userProfile, updateUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};