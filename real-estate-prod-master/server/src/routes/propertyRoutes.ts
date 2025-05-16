import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
} from "../controllers/propertyControllers";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);

// Envolvemos createProperty en un try/catch para mostrar errores en consola
router.post(
  "/",
  authMiddleware(["manager"]),
  upload.array("photos"),
  async (req, res) => {
    try {
      await createProperty(req, res);
    } catch (err) {
      console.error("Error en /properties:", err);
      try {
        console.error("Error string:", String(err));
        console.error("Error JSON:", JSON.stringify(err));
      } catch {}
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  }
);

export default router;