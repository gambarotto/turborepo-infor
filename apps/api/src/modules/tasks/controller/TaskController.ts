import { Prisma, User } from '@prisma/client';
import { Request, Response } from 'express'
import AppError from "../../../error/AppError";
import { prisma } from "../../../server";

class TasksController {
  async store(req: Request, res: Response): Promise<Response> {
    const { content } = req.body;
    const userId = req.user.id;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return res.status(400).json({ Message: "user does not exists" })
      };
      const task = await prisma.task.create({
        data: {
          content,
          done: false,
          user: {
            connect: { id: userId }
          }
        }
      });
      return res.json(task)
    } catch (error: any) {
      throw new AppError('Error creating task', 400)
    }
  }
  //TODO check user id
  async index(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id;
    try {
      const task = await prisma.task.findMany({
        where: {
          userId,
        }
      })
      return res.json(task)
    } catch (error: any) {
      throw new AppError('task not found', 404)
    }
  }
  async update(req: Request, res: Response): Promise<Response> {
    const { content, done } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    try{
      const task = await prisma.user.update({
        where: {
          id: userId
        },
        include: {
          tasks: true
        },
        data: {
          tasks: {
            update: {
              where: {
                id,
              },
              data: {
                content,
                done
              },
            }
          },
        }
      })
      const editedTask = task.tasks.find(item => item.id === id);
      return res.json(editedTask);
    }catch(error) {
      throw new AppError('error on update', 500);
    }
  }
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      await prisma.user.update({
        where: { id: userId },
        include: { tasks: true },
        data: {
          tasks: {
            delete: { id },
          },
        }
      });
      return res.json({ message: "task deleted" });
    } catch (error) {
      throw new AppError('task not found', 404);
    }
  }
}
export default new TasksController();