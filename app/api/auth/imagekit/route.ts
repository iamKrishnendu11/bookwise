import ImageKit from "@imagekit/nodejs";
import config from "@/lib/config";
import { NextResponse } from "next/server";

const {
    env: {
        imagekit: { privateKey },
    },
} = config;

const imagekit = new ImageKit({ privateKey });


export async function GET() {
    return NextResponse.json(imagekit.helper.getAuthenticationParameters());
}