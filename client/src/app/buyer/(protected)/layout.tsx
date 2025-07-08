import ProtectedRoute from "@/app/components/Protected";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ProtectedRoute roles={["buyer"]}>{children}</ProtectedRoute>;
}
