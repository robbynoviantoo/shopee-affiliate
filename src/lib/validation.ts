import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.string().optional(),
  category: z.string().min(2),
  imageUrl: z.string().url(),
  affiliateUrl: z.string().url(),
  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export type ProductInput = z.infer<typeof productSchema>;
