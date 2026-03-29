import app from "./app";
import { prisma } from "./app/lib/prisma";

const port = process.env.PORT || 5000;

// Start the server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer()