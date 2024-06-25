import { Document, model, Schema } from 'mongoose';
import { ISessions } from "../../interfaces/ISessions"

// Assuming you've already established your mongoose connection elsewhere
// const mongoDB = 'your_mongodb_uri';
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema that matches the structure of the sessions in your database
const SessionSchema = new Schema<ISessions>({
    _id: {
        type: String
    },
    expires: {
        type: String
    }, session: {
        type: String

    },
}, { strict: false });

// If your sessions are stored in a collection with a name other than 'sessions', replace 'sessions' with the correct name
const Session = model('Session', SessionSchema, 'sessions');
export default Session;
// ... rest of your setup (Express, Passport, etc.)
