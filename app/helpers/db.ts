import { connect } from "mongoose"

export default () => {
    connect(process.env.MONGO!, { dbName: 'test' });
};
