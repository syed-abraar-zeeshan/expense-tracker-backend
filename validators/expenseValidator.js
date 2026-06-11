const { z } = require("zod");

const expenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title too long"),

  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({
      message: "Type must be income or expense",
    }),
  }),
  date: z.string().optional(),
  note: z.string().max(500, "Note too long").optional(),
});

module.exports = {
  expenseSchema,
};
