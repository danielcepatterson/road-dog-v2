// src/App.tsx

import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm, SignupForm } from "./components/Auth";
import { ShowCalendar } from "./components/ShowCalendar";
import { ShowBookingForm } from "./components/ShowForm";
import "./App.css";

function AppContent() {
	const { user, logout } = useAuth();
	const [authMode, setAuthMode] = useState<"login" | "signup">("login");
	const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

	if (!user) {
		return (
			<div className="auth-container">
				<div className="auth-panel">
					{authMode === "login" ? (
						<>
							<LoginForm onAuthSuccess={() => {}} />
							<p className="auth-toggle">
								Don't have an account?{" "}
								<button onClick={() => setAuthMode("signup")}>
									Sign Up
								</button>
							</p>
						</>
					) : (
						<>
							<SignupForm onAuthSuccess={() => {}} />
							<p className="auth-toggle">
								Already have an account?{" "}
								<button onClick={() => setAuthMode("login")}>Login</button>
							</p>
						</>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="app-container">
			<header className="app-header">
				<h1>Band Manager</h1>
				<button onClick={logout} className="logout-button">
					Logout ({user.email})
				</button>
			</header>

			<main className="app-main">
				{isBookingFormOpen ? (
					<ShowBookingForm
						onClose={() => setIsBookingFormOpen(false)}
						onShowCreated={() => setIsBookingFormOpen(false)}
					/>
				) : (
					<ShowCalendar
						onBookingClick={() => setIsBookingFormOpen(true)}
					/>
				)}
			</main>
		</div>
	);
}

function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
}

export default App;
