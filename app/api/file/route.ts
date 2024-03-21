import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { promisify } from "util";

const pump = promisify(require("stream").pipeline);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (files.length > 0) {
      const file: File = files[0] as File; // Cast to File
      const filePath = `./public/${file.name}`;
      const fileStream = fs.createWriteStream(filePath);

      const readableStream = file.stream();

      // Create a pump to handle data transfer from readable stream to file stream
      await pump(readableStream, fileStream);

      // Wait for the stream to finish writing
      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });

      return NextResponse.json({ status: "success", data: file.size });
    } else {
      return NextResponse.json({ status: "fail", data: "No files provided" });
    }
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
}
