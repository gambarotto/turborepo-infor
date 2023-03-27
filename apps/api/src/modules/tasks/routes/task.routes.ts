import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ensureAuthenticated from '../../middlewares/unsureAuth';
import TaskController from '../controller/TaskController';

const taskRoutes = Router();

const validationRequestCreateTask = celebrate({
  [Segments.BODY]: {
    content: Joi.string().required(),
  },
});
taskRoutes.use(ensureAuthenticated);
taskRoutes.post('/task', validationRequestCreateTask, TaskController.store);
taskRoutes.get('/task', TaskController.index);
taskRoutes.put('/task/:id', TaskController.update);
taskRoutes.delete('/task/:id', TaskController.delete);

export default taskRoutes;