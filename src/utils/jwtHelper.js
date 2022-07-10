import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config ();


// Generate a json web token and then return that signed payload
export const generateToken = async payload => {
    return await jwt.sign(payload, process.env.JWTSECRET, {
        expiresIn: parseInt(process.env.TOKENEXPIRATIONTIME, 10),
    });
};

// Validate the jason web token using the token and process.env to verify
export const jwtValidator = async token => {
    try {
        const decodedToken = await jwt.verify(token, process.env.JWTSECRET);
        return decodedToken;
    } catch (error) {
        return false;
    }
};