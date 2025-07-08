"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({
	children,
	roles,
}: {
	children: React.ReactNode;
	roles?: string[];
}) {
	const { user, loading } = useAuth();

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!user || (roles && !roles.includes(user.role))) {
		return <div>Unauthorized</div>;
	}

	return <>{children}</>;
}
