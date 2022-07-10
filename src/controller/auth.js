import { ulid } from "ulid";
import { hash, compare } from 'bcrypt';
import { redisClient } from '../db/index.js';
import { generateToken } from '../utils/jwtHelper.js'

const createAccount = async (req, res) => {
    try {
        const { firstName, lastName, email, password, displayName } = req.body;

        // Generate id for the user which be used as the key in Redis 
        const userId = ulid(); 

        // Check if user with that email already exists
        const userEmail = await redisClient.hgetall(`user:${email}`);

        if(userEmail.email === email) {
            return res.status(409).send({
                error: true,
                message: 'Account with that email already exists',
                data: '',
            });
        }

        // Encrypt the users password before saving
    }
}