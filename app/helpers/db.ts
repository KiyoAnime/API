import { connect, set } from 'mongoose';

export default () => {
    set('strictQuery', false);
    connect(process.env.MONGO_URL!, { dbName: 'kiyo' });
};
