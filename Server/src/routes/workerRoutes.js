import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// GET all workers
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("workers")
      .select(
        `
        id,
        business_id,
        name,
        slug,
        email,
        profile_image,
        bio,
        created_at
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching workers:", error);

      return res.status(500).json({
        error: error.message,
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// POST a new worker
router.post("/", async (req, res) => {
  try {
    const { businessId, name, email, bio, profileImage } = req.body;

    // Validate required fields
    if (!businessId || !name || !email) {
      return res.status(400).json({
        error: "Business ID, name, and email are required",
      });
    }

    // Create a slug from the worker's name
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    const { data, error } = await supabase
      .from("workers")
      .insert({
        business_id: businessId,
        name: name.trim(),
        slug,
        email: email.trim(),
        bio: bio?.trim() || null,
        profile_image: profileImage || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating worker:", error);

      return res.status(500).json({
        error: error.message,
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// UPDATE a worker
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio, profileImage } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    // Create a new slug from the updated name
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    const { data, error } = await supabase
      .from("workers")
      .update({
        name: name.trim(),
        slug,
        email: email.trim(),
        bio: bio?.trim() || null,
        profile_image: profileImage || null,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating worker:", error);

      return res.status(500).json({
        error: error.message,
      });
    }

    res.json(data[0]);
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// GET a specific worker by slug
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
