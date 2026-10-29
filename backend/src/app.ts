import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./modules/auth/routes";
import surveyRoutes from "./modules/surverys/route";
import sectionRoutes from "./modules/sections/routes";
import questionRoutes from "./modules/questions/route";
import questionOptionRoutes from "./modules/question-options/route";
import questionMatrixRowRoutes from "./modules/questionMatrixRow/routes";
import submissionRoutes from "./modules/submissions/routes";
import publicRoutes from "./modules/public/route";
import { errorHandler } from "./middlewares/errorHandler";
import dashboardRoutes from "./modules/dashboard/route";
import reportRoutes from "./modules/reports/routes";
import assignmentRoutes from "./modules/assignments/routes";
import settingsRoutes from "./modules/settings/routes";
import usersRoutes from "./modules/users/routes";
import corsOptions from "./config/corsOptions";
import organizationRoutes from "./modules/organizations/routes";
import path from "path";
export const prisma = new PrismaClient();
const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_, res) => {
  res.json({
    message: "Survey Builder API",
  });
});

app.use("/auth", authRoutes);
app.use("/surveys", surveyRoutes);
app.use("/sections", sectionRoutes);
app.use("/questions", questionRoutes);
app.use("/question-options", questionOptionRoutes);
app.use("/question-matrix-rows", questionMatrixRowRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/submissions", submissionRoutes);
app.use("/public", publicRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/settings", settingsRoutes);
app.use("/reports", reportRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/users", usersRoutes);
app.use(errorHandler);

export default app;
