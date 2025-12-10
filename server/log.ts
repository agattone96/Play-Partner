import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Helper for express request logging
export function logRequest(req: any, res: any, duration: number, capturedJsonResponse?: any) {
    const path = req.path;
    let logData: any = {
      method: req.method,
      path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };
    if (capturedJsonResponse) {
      logData.response = capturedJsonResponse;
    }
    logger.info("API Request", logData);
}
