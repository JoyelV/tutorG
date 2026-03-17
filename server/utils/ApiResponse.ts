/**
 * Utility class for standardized API responses.
 * Ensures all successful responses follow the same JSON structure.
 * 
 * @param {number} statusCode - The HTTP status code
 * @param {any} data - The actual response data (payload)
 * @param {string} message - Optional success message (defaults to 'Success')
 */
export class ApiResponse {
    public readonly statusCode: number;
    public readonly data: any;
    public readonly message: string;
    public readonly success: boolean;

    constructor(statusCode: number, data: any, message: string = 'Success') {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
