export const API_BASE_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "http://coursemanager-env.eba-jt2n4jdm.us-east-1.elasticbeanstalk.com";
