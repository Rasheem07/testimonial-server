import {redisClient} from '../config/redis';

const storeRefreshToken = async (userId: string, refreshToken: string) => {
    await redisClient.set(String(userId), refreshToken, { EX: 7 * 24 * 60 * 60 }); // Expires in 7 days
};  

const getStoredRefreshToken = async (userId: string) => {
    return await redisClient.get(userId);
};

const deleteStoredRefreshToken = async (userId: string) => {
    await redisClient.del(userId);
};

export {storeRefreshToken, getStoredRefreshToken, deleteStoredRefreshToken};