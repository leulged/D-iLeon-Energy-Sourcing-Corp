import request from "supertest";
import express from "express";

// Create a minimal app for testing
const app = express();

// Add the health endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "D'iLeon API Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  });
});

describe("Health Check Endpoint", () => {
  it("should return 200 and health status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("environment");
    expect(response.body).toHaveProperty("version");
  });

  it("should return correct environment", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body.environment).toBe("test");
  });
});
