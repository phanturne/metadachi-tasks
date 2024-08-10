"use client";

import AuthModal from "@/components/auth/AuthModal";
import { createContext, useContext, useState } from "react";

export enum AuthFormType {
	Login = 0,
	SignUp = 1,
	ForgotPassword = 2,
	ResetPassword = 3,
}

// Create a context with initial values
const AuthContext = createContext({
	openAuthModal: (type?: AuthFormType) => {},
	closeAuthModal: () => {},
});

// Context Provider
export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [authModalType, setAuthModalType] = useState<AuthFormType | undefined>(
		undefined,
	);

	const openAuthModal = (type?: AuthFormType) => {
		setAuthModalType(type);
		setIsAuthModalOpen(true);
	};

	const closeAuthModal = () => {
		setIsAuthModalOpen(false);
		setAuthModalType(undefined);
	};

	// Pass the context values to the provider
	const contextValue = {
		openAuthModal,
		closeAuthModal,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			<AuthModal
				open={isAuthModalOpen}
				onClose={closeAuthModal}
				type={authModalType}
			/>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthModalContext
export const useAuthModal = () => {
	return useContext(AuthContext);
};
