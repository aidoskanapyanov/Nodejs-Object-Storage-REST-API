import { z } from "zod";

export const AuthSchema = z.object({
  body: z.object({
    id: z.string(),
    // password should be at least 6 characters
    password: z.string().min(6),
  }),
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  } catch (err) {
    return res.status(400).send(err.errors);
  }
};
