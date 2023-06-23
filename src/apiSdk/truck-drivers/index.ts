import axios from 'axios';
import queryString from 'query-string';
import { TruckDriverInterface, TruckDriverGetQueryInterface } from 'interfaces/truck-driver';
import { GetQueryInterface } from '../../interfaces';

export const getTruckDrivers = async (query?: TruckDriverGetQueryInterface) => {
  const response = await axios.get(`/api/truck-drivers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTruckDriver = async (truckDriver: TruckDriverInterface) => {
  const response = await axios.post('/api/truck-drivers', truckDriver);
  return response.data;
};

export const updateTruckDriverById = async (id: string, truckDriver: TruckDriverInterface) => {
  const response = await axios.put(`/api/truck-drivers/${id}`, truckDriver);
  return response.data;
};

export const getTruckDriverById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/truck-drivers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTruckDriverById = async (id: string) => {
  const response = await axios.delete(`/api/truck-drivers/${id}`);
  return response.data;
};
