import { User } from "../../types/user.type";

export interface LoginResponseDto {
	message: string;
	token: string;
	user: Pick<
		User,
		| "id"
		| "email"
		| "firstName"
		| "lastName"
		| "company"
		| "role"
		| "isEmailVerified"
	>;
}
