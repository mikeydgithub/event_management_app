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
            'lastName',
            `${lastName}`,
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
        const user = await redisClient.hgetall(`user:${email}`);

        if (!user.email || ! validatePassword) {
            return res.status(401).send({
                error: true,
                message: 'Invalid email or password',
            });
        }

        // Generate a token for the user to perform other operations

        const token = await generateToken({ userKey: `user:${email}`, userId: user.id})

        return res.status(200).send({
            error: false,
            message: 'Login successfully',
            data: { token },
        });
    } catch (error) {
        return `Server error, please try again later. ${error}`;
    }
};

export { createAccount, login };