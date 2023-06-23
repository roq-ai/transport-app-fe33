import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { truckDriverValidationSchema } from 'validationSchema/truck-drivers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.truck_driver
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTruckDriverById();
    case 'PUT':
      return updateTruckDriverById();
    case 'DELETE':
      return deleteTruckDriverById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTruckDriverById() {
    const data = await prisma.truck_driver.findFirst(convertQueryToPrismaUtil(req.query, 'truck_driver'));
    return res.status(200).json(data);
  }

  async function updateTruckDriverById() {
    await truckDriverValidationSchema.validate(req.body);
    const data = await prisma.truck_driver.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteTruckDriverById() {
    const data = await prisma.truck_driver.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
