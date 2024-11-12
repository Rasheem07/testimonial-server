import { redisClient } from '../lib/redis'; 

const storeRefreshToken = async (userId: string, refreshToken: string) => {
    await redisClient.set(String(userId), refreshToken, { EX: 7 * 24 * 60 * 60 }); // Expires in 7 days
};

const getStoredRefreshToken = async (userId: string) => {
    const storedToken = await redisClient.get(String(userId));
    return storedToken; 
};

const deleteStoredRefreshToken = async (userId: string) => {
    await redisClient.del(String(userId));
};

export { storeRefreshToken, getStoredRefreshToken, deleteStoredRefreshToken };
