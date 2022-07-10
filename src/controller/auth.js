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
        const hashedPassword = await hash(password, 10);

        // Create user account
        const createUser = await redisClient.execute([
            'HSET',
            `user:${email}`,
            'id',
            `${userId}`,
            'firstName',
            `${firstName}`,
            'email',
            `${email}`,
            'password',
            `${hashedPassword}`,
            'displayName',
            `${displayName}`,
        ]);

        // Generate token for the user
        const token = await generateToken({ userKey: `user:${email}`, userId})

        if( createUser && typeof createUser === 'number') {
            return res.status(201).send({
                error: false,
                message: 'Account succesfully created',
                data: {token},
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: `Server error, please try again later. ${error}`
        });
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Get the user details from redis
    }
}