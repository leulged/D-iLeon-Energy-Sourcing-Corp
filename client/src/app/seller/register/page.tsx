"use client";
export const dynamic = "force-dynamic";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function SellerRegisterPageContent() {
	const router = useRouter();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		router.push("/buyer/dashboard");
		// setError("");
		// setSuccess("");
		// if (password !== confirmPassword) {
		//   setError("Passwords do not match.");
		//   return;
		// }
		// setLoading(true);
		// try {
		//   const res = await fetch(`${API_URL}/api/auth/register`, {
		//     method: "POST",
		//     headers: { "Content-Type": "application/json" },
		//     body: JSON.stringify({
		//       firstName,
		//       lastName,
		//       email,
		//       password,
		//       role: "seller",
		//     }),
		//   });
		//   const data = await res.json();
		//   if (!res.ok) throw new Error(data.message || "Registration failed");
		//   router.push(
		//     `/check-email?email=${encodeURIComponent(email)}&role=seller`
		//   );
		// } catch (err) {
		//   if (err instanceof Error) setError(err.message);
		//   else setError("An error occurred.");
		// } finally {
		//   setLoading(false);
		// }
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
			<form
				onSubmit={handleSubmit}
				className="bg-neutral-900 rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 border border-neutral-800"
			>
				<h2 className="text-2xl font-bold mb-2 text-center">
					Create Seller Account
				</h2>
				{error && (
					<div className="bg-red-700 text-white rounded p-2 text-center">
						{error}
					</div>
				)}
				{success && (
					<div className="bg-green-700 text-white rounded p-2 text-center">
						{success}
					</div>
				)}
				<div className="flex gap-2 w-full">
					<input
						type="text"
						placeholder="First Name"
						className="flex-1 min-w-0 px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
					<input
						type="text"
						placeholder="Last Name"
						className="flex-1 min-w-0 px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
				</div>
				<input
					type="email"
					placeholder="Email"
					className="px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<div className="flex gap-2 w-full">
					<input
						type="password"
						placeholder="Password"
						className="flex-1 min-w-0 px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={8}
						autoComplete="new-password"
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						className="flex-1 min-w-0 px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						minLength={8}
						autoComplete="new-password"
					/>
				</div>
				<button
					type="submit"
					className="mt-4 px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
					disabled={loading}
				>
					{loading ? "Registering..." : "Register as Seller"}
				</button>
				<div className="text-center text-neutral-400 mt-2">
					Already have an account?{" "}
					<a
						href="/seller/login"
						className="text-orange-400 hover:underline cursor-pointer"
					>
						Login as Seller
					</a>
				</div>
			</form>
		</div>
	);
}

export default function SellerRegisterPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SellerRegisterPageContent />
		</Suspense>
	);
}
