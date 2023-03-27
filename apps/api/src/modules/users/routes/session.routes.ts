import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import SessionController from '../controller/SessionController';

const sessionRoutes = Router();

const validationRequestCreate = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  },
});

sessionRoutes.post('/session', validationRequestCreate, SessionController.store);
sessionRoutes.post('/session', SessionController.delete);


export default sessionRoutes;