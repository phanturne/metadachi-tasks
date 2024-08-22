export const Routes = {
	Home: "/",
	Login: "/login",
	SignUp: "/sign-up",
	Setup: "/setup",
	ResetPassword: "/reset-password",
	Assistants: "/assistants",
	Tasks: "/tasks",
	Rewards: "/rewards",
	Moments: "/moments",
	Chat: "/chat",
	Friends: "/friends",
	Leaderboard: "/leaderboard",
	Collections: "/collections",
	Explore: "/explore",
	Tools: "/tools",
	History: "/history",
	Settings: "/settings",
	Profile: "/profile",
	Help: "/help",
	NotFound: "/404",
};

export const ProtectedRoutes = [Routes.Setup, Routes.Settings];
