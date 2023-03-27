import { Request, Response } from 'express';
import { prisma } from '../../../server';
import authJwtConfig from '../../../config/jwt/auth';
import { sign } from 'jsonwebtoken';
import AppError from '../../../error/AppError';
import { checkPassword } from '../../../lib/bcrypt';

class SessionController {
  async store(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      if (!user) {
        return res.status(404).json({ Message: "user not found" })
      }

      const passwordMatch = await checkPassword(password, user?.passwordHash as string);
      if(!passwordMatch){
        return res.status(404).json({ Message: "invalid user or password" })
      }
      const { secret, expiresIn } = authJwtConfig;

      const token = sign({}, secret, {
        subject: String(user?.id),
        expiresIn,
      })
      return res.json({ token: token, user })
    } catch (error: any) {
      throw new AppError('Error creating user', 400)
    }
  }
  async delete(req: Request, res: Response): Promise<Response> {
    res.clearCookie('jwt'); // limpa o cookie 'jwt'
    return res.status(200).send('Log out successfully');
  }
}
export default new SessionController();