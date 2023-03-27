import taskRoutes from './modules/tasks/routes/task.routes';
import sessionRoutes from './modules/users/routes/session.routes';
import userRoutes from './modules/users/routes/user.routes';

const routes = [sessionRoutes,userRoutes, taskRoutes]
export default routes;