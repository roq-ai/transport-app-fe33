import { TruckDriverInterface } from 'interfaces/truck-driver';
import { GetQueryInterface } from 'interfaces';

export interface JobInterface {
  id?: string;
  title: string;
  description?: string;
  status: string;
  truck_driver_id: string;
  created_at?: any;
  updated_at?: any;

  truck_driver?: TruckDriverInterface;
  _count?: {};
}

export interface JobGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  truck_driver_id?: string;
}
