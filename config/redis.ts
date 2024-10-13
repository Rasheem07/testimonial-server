import {createClient} from 'redis';

const redisClient = createClient({
    url: 'redis://redis-12273.c266.us-east-1-3.ec2.redns.redis-cloud.com:12273',
    username: "default",
    password: 'Xk68SZjKI6hSmFw30qDN4QCXJKqUujxp'
});
 

const connectToRedis = async () => {
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log("redis connected succussfully!");
}
 
export {redisClient, connectToRedis};
