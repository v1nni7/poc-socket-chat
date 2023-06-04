import express, { json } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(json());

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
