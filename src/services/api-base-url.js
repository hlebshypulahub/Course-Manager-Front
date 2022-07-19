export const API_BASE_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : 
        "https://hlebshypula-proxy.herokuapp.com/http://coursemanager-env.eba-8ih3jpi9.eu-central-1.elasticbeanstalk.com";
