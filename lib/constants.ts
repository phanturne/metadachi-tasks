export const Routes = {
	Home: "/",
	Login: "/login",
	SignUp: "/sign-up",
	Setup: "/setup",
	ResetPassword: "reset-password",
	Assistants: "assistants",
	Rewards: "/rewards",
	Friends: "/friends",
	Leaderboard: "/leaderboard",
	History: "/history",
	Settings: "/settings",
	Profile: "/profile",
	Help: "/help",
	NotFound: "/404",
};

export const ProtectedRoutes = [Routes.Setup, Routes.Settings];
