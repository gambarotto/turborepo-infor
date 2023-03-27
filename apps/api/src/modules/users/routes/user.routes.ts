import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ensureAuthenticated from '../../middlewares/unsureAuth';
import UserController from '../controller/UserController';

const userRoutes = Router();

const validationRequestCreate = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  },
});

userRoutes.post('/user', validationRequestCreate, UserController.store);
userRoutes.use(ensureAuthenticated);
userRoutes.get('/user', UserController.index);
userRoutes.put('/user', UserController.update);
userRoutes.delete('/user', UserController.delete);

export default userRoutes;