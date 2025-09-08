import { authRoute } from "./routes/auth.route";
import { categoryRoute } from "./routes/category.route";
import { productRoute } from "./routes/product.route";
import { sectionRoute } from "./routes/section.route";

export const router = {
  auth: authRoute,
  section: sectionRoute,
  category: categoryRoute,
  product: productRoute,
};

export type RPCRouter = typeof router;
