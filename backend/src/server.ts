import "dotenv/config";
import app from "./app";

const port = process.env.PORT ? Number(process.env.PORT) : 8080;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
