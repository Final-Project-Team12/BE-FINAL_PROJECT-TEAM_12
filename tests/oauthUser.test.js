const GoogleAuthController = require('../controllers/googleAuthController');
const googleAuthService = require('../services/googleAuthService');

describe('GoogleAuthController - googleCallback', () => {
    it('should return 400 if no code is provided', async () => {
        const req = { query: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await GoogleAuthController.googleCallback(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 400,
            message: 'No code received from Google. Please try again.',
        });
    });

    it('should return 401 if user needs to set a password', async () => {
        jest.spyOn(googleAuthService, 'getGoogleUserProfile').mockResolvedValue({
            userInfo: { data: { email: 'newuser@example.com', name: 'New User' } },
        });

        jest.spyOn(googleAuthService, 'handleGoogleUser').mockResolvedValue({
            resetToken: 'mock-reset-token',
        });

        const req = { query: { code: 'mock-code' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await GoogleAuthController.googleCallback(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            status: 401,
            message: 'Please set your password',
            resetToken: 'mock-reset-token',
        });
    });

    it('should return 200 for successful login', async () => {
        jest.spyOn(googleAuthService, 'getGoogleUserProfile').mockResolvedValue({
            userInfo: { data: { email: 'existinguser@example.com', name: 'Existing User' } },
        });

        jest.spyOn(googleAuthService, 'handleGoogleUser').mockResolvedValue({
            accessToken: 'mock-access-token',
        });

        const req = { query: { code: 'mock-code' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await GoogleAuthController.googleCallback(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            message: 'Login success',
            accessToken: 'mock-access-token',
        });
    });
});