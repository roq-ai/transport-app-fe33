import { JobInterface } from 'interfaces/job';
import { LocationInterface } from 'interfaces/location';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface TruckDriverInterface {
  id?: string;
  user_id: string;
  organization_id: string;
  created_at?: any;
  updated_at?: any;
  job?: JobInterface[];
  location?: LocationInterface[];
  user?: UserInterface;
  organization?: OrganizationInterface;
  _count?: {
    job?: number;
    location?: number;
  };
}

export interface TruckDriverGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  organization_id?: string;
}
