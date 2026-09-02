import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// GET all workers
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const { data, error } = await supabase
    .from("workers")
    .select(
      `
      id,
      name,
      slug,
      email,
      profile_image,
      bio,
      business:businesses (
        id,
        name,
        slug,
        logo_url
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

export default router;
