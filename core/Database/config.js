import "dotenv/config";

import mongoose from "mongoose";

const { connection, connect } = mongoose;

export const DatabaseConnection = async () => {
  const dbUrl = process.env.DATABASE_URL;
  let isConnected = false;
  let retryCount = 0;
  const maxRetries = 10;

  while (!isConnected && retryCount < maxRetries) {
    try {
      const con = await connect(dbUrl);
      const isConnectionSuccess = connection.readyState === 1;
      if (isConnectionSuccess) {
        console.log(
          `MongoDB Database is connected Successfully and Database connection is active on :  ${con.connection.host}`
        );
      } else {
        console.log("Database connection is not active");
      }
      isConnected = true;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      console.log("Retrying connection in 5 seconds...");
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds delay
    }
  }

  if (!isConnected) {
    console.error(
      `Failed to connect to the database after ${maxRetries} attempts.`
    );
  }
};
