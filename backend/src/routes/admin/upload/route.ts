import fastifyMultipart from "@fastify/multipart";
import { FastifyInstance } from "fastify";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { HttpConstant } from "src/constants/HttpConstant";
import { CustomError } from "src/utils/custom-error";

export default async function routes(fastify: FastifyInstance) {
  await fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 1024 * 1024 * 50,
    },
  });

  fastify.post(
    "/image",
    {
      config: {
        swaggerTransform({ url }) {
          return {
            schema: {
              tags: ["upload"],
              consumes: ["multipart/form-data"],
              body: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary" },
                },
              },
            },
            url: url,
          };
        },
      },
    },
    async (request, reply) => {
      const file = await request.file();

      if (!file) {
        throw new CustomError({
          message: "No file uploaded",
          statusCode: HttpConstant.BAD_REQUEST,
        });
      }

      // Validate file type (optional)
      if (!file.mimetype.startsWith("image/")) {
        throw new CustomError({
          message: "Only image files are allowed",
          statusCode: HttpConstant.BAD_REQUEST,
        });
      }

      // Here you would typically process the file
      // For example, save it to disk or cloud storage
      const buffer = await file.toBuffer();

      // Create images directory if it doesn't exist
      const uploadDir = join(process.cwd(), "public", "images");
      await mkdir(uploadDir, { recursive: true });

      // Generate unique filename to prevent overwrites
      const uniqueFilename = `${Date.now()}-${file.filename}`;
      const filePath = join(uploadDir, uniqueFilename);

      // Save the file
      await writeFile(filePath, buffer);

      return reply.status(HttpConstant.CREATED).send({
        message: "File uploaded successfully",
        filename: uniqueFilename,
        mimetype: file.mimetype,
        size: buffer.length,
        path: `/images/${uniqueFilename}`,
      });
    },
  );
}
