/**
 * Sign in response model
 * @summary
 * This model is used to create a sign in response object
 */
export class SignInResponse {
    /**
     * Constructor
     * @param id The user id
     * @param email The username
     * @param token The generated token
     * @param role The user role
     */
    constructor(id, email, token, role) {
        this.id = id;
        this.email = email;
        this.token = token;
        this.role = role;
    }
}