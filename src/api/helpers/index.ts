import { TableName } from '@/types';
import { axiosInstance } from '..';

export const getDataList = async <T>(
  table_name: TableName,
  params: Record<string, string | string[] | undefined> | URLSearchParams,
) => {
  const { data } = await axiosInstance.get(`${table_name}`, { params });

  return data as T[];
};

export const getData = async <T>(
  table_name: TableName,
  params: Record<string, string>,
) => {
  const { data } = await axiosInstance.get(`${table_name}`, {
    headers: { Accept: 'application/vnd.pgrst.object+json' },
    params,
  });

  return data as T;
};

export const postData = async <T>(
  table_name: TableName,
  data: T,
  params?: Record<string, string | number>,
) => await axiosInstance.post(`${table_name}`, data, { params });

export const patchData = async <T>(
  table_name: TableName,
  data: T,
  params?: Record<string, string>,
) => await axiosInstance.patch(`${table_name}`, data, { params });

export const deleteData = async (
  table_name: TableName,
  params: Record<string, string>,
) => await axiosInstance.delete(`${table_name}`, { params });
