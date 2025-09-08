import { ImageType } from "@generated/client/enums";

import { z } from "zod";

export const ImagesSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string().min(1, "Image name is required"),
  type: z.enum(ImageType, { error: "Invalid image type" }),
  image: z.url({ error: "Image is required" }),
  link: z.string().optional().default(""),
  isFormLink: z.boolean().default(false),
  priority: z.number().optional().default(-1),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ImagesSchema = z.infer<typeof ImagesSchema>;
