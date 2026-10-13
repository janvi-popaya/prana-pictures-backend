import adminFilmRoutes from "./admin-film.routes.js";
import adminAuthRoutes from "./admin-auth.routes.js";
import adminTeamRoutes from "./admin-team.routes.js";
import adminNewsRoutes from "./admin-news.routes.js";
import contactRoutes from "./contact.routes.js";
import publicFilmRoutes from "./public-film.routes.js";
import publicTeamRoutes from "./public-team.routes.js";
import publicNewsRoutes from "./public-news.routes.js";

const baseUrl = "/api/v1";

const routes = (app: any) => {
  app.use(`${baseUrl}/contact`, contactRoutes);

  app.use(`${baseUrl}/films`, publicFilmRoutes);
  app.use(`${baseUrl}/team`, publicTeamRoutes);
  app.use(`${baseUrl}/news`, publicNewsRoutes);

  app.use(`${baseUrl}/admin/auth`, adminAuthRoutes);
  app.use(`${baseUrl}/admin/films`, adminFilmRoutes);
  app.use(`${baseUrl}/admin/team`,adminTeamRoutes);
  app.use(`${baseUrl}/admin/news`, adminNewsRoutes);
};

export default routes;
