import * as yup from 'yup';

export const locationValidationSchema = yup.object().shape({
  latitude: yup.number().required(),
  longitude: yup.number().required(),
  timestamp: yup.date().required(),
  truck_driver_id: yup.string().nullable().required(),
});
