import mongoose from "mongoose"

let isConnectedToDB = false

export const getconnectionToMongoDB = async () => {
    // mongoose.set("strictQuery", true)
    
    try {
        if (!process.env.MONGODB_URI) {
            console.log("Did not got the MongoDb URI")
            return 
        }

        if(isConnectedToDB) {
            console.log("MongoDB connection already established")
            return 
        }

        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: 'flexible',
        })

        isConnectedToDB = true
        console.log("connected to MongoDB")

    } catch (error) {
        console.log(error)
    }
}