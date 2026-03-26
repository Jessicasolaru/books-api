import { Server } from "./src/service/server/server.service.js";

Server.bootstrap({
  multiFormat: true,
  loggerPerformance: true,
});
