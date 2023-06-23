import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createLocation } from 'apiSdk/locations';
import { Error } from 'components/error';
import { locationValidationSchema } from 'validationSchema/locations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { TruckDriverInterface } from 'interfaces/truck-driver';
import { getTruckDrivers } from 'apiSdk/truck-drivers';
import { LocationInterface } from 'interfaces/location';

function LocationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: LocationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createLocation(values);
      resetForm();
      router.push('/locations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<LocationInterface>({
    initialValues: {
      latitude: 0,
      longitude: 0,
      timestamp: new Date(new Date().toDateString()),
      truck_driver_id: (router.query.truck_driver_id as string) ?? null,
    },
    validationSchema: locationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Location
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="latitude" mb="4" isInvalid={!!formik.errors?.latitude}>
            <FormLabel>Latitude</FormLabel>
            <NumberInput
              name="latitude"
              value={formik.values?.latitude}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('latitude', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors?.latitude && <FormErrorMessage>{formik.errors?.latitude}</FormErrorMessage>}
          </FormControl>
          <FormControl id="longitude" mb="4" isInvalid={!!formik.errors?.longitude}>
            <FormLabel>Longitude</FormLabel>
            <NumberInput
              name="longitude"
              value={formik.values?.longitude}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('longitude', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors?.longitude && <FormErrorMessage>{formik.errors?.longitude}</FormErrorMessage>}
          </FormControl>
          <FormControl id="timestamp" mb="4">
            <FormLabel>Timestamp</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.timestamp ? new Date(formik.values?.timestamp) : null}
                onChange={(value: Date) => formik.setFieldValue('timestamp', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<TruckDriverInterface>
            formik={formik}
            name={'truck_driver_id'}
            label={'Select Truck Driver'}
            placeholder={'Select Truck Driver'}
            fetcher={getTruckDrivers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'location',
  operation: AccessOperationEnum.CREATE,
})(LocationCreatePage);
