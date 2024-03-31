import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET 
});

export async function POST(req: Request) {
    const {path} = await req.json()
    console.log("line 12 ", path)
    if (!path) {
        return NextResponse.json(
            {message: 'Image path is required'},
            {status: 400} 
        )
    }

    try {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            transformation: [{width: 1000, height: 752, crop: 'scale'}]
        }

        const result = await cloudinary.uploader.upload(path, options)
        console.log("line 29 ", result)
        return NextResponse.json(result, {status: 200})
    } catch (error: any) {
        console.log("line 32 ", error.message)
        return NextResponse.json({message: error.message}, {status: 500})
    }
}