//TODO: Change the interfaces in input dtos to zod schemas to validate input for apis
export interface LoginDto {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: string;
	company?: string;
}
