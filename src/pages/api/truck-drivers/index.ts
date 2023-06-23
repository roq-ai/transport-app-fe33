import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { truckDriverValidationSchema } from 'validationSchema/truck-drivers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTruckDrivers();
    case 'POST':
      return createTruckDriver();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTruckDrivers() {
    const data = await prisma.truck_driver
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'truck_driver'));
    return res.status(200).json(data);
  }

  async function createTruckDriver() {
    await truckDriverValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.job?.length > 0) {
      const create_job = body.job;
      body.job = {
        create: create_job,
      };
    } else {
      delete body.job;
    }
    if (body?.location?.length > 0) {
      const create_location = body.location;
      body.location = {
        create: create_location,
      };
    } else {
      delete body.location;
    }
    const data = await prisma.truck_driver.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
