import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";


// In component:
const formik = useFormik({
  initialValues: { companyName: "" /* all fields */ },
  validationSchema: toFormikValidationSchema(jobSchema),
  onSubmit: async (values) => {
    // POST to /api/jobs
    await fetch("/api/jobs", { method: "POST", body: JSON.stringify(values) });
    // Refresh list
  },
});

// Render form with Input fields, errors via formik.errors
// Table for listing jobs (Shadcn Table component), with edit/delete buttons
