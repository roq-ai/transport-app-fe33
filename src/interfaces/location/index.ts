import { TruckDriverInterface } from 'interfaces/truck-driver';
import { GetQueryInterface } from 'interfaces';

export interface LocationInterface {
  id?: string;
  latitude: number;
  longitude: number;
  timestamp: any;
  truck_driver_id: string;
  created_at?: any;
  updated_at?: any;

  truck_driver?: TruckDriverInterface;
  _count?: {};
}

export interface LocationGetQueryInterface extends GetQueryInterface {
  id?: string;
  truck_driver_id?: string;
}
