'use server';
import returnFetch from 'return-fetch';
import { cookies } from 'next/headers';

const URL_PROD = process.env.NEXT_PUBLIC_API_PROD_URL;
const URL_TEST = process.env.NEXT_PUBLIC_API_TEST_URL;
const deployMode = process.env.NEXT_PUBLIC_NODE_ENV;
const baseUrl = deployMode === 'production' ? URL_PROD : URL_TEST;

export const fetchDefault = returnFetch({
  baseUrl: baseUrl,
  interceptors: {
    request: async (args) => {
      if (args[1]) {
        const reqCookies = await cookies();
        args[1].headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${reqCookies.get('access-token')?.value || ''}`,
        };
      }
      return args;
    },
    response: async (response) => { 
      return response;
    },
  },
});

export const fetchForm = returnFetch({
  baseUrl: baseUrl,
  interceptors: {
    request: async (args) => {
      if (args[1]) {
        const reqCookies = await cookies();
        args[1].headers = {
          ...args[1].headers,
          Authorization: `Bearer ${reqCookies.get('access-token')?.value || ''}`,
        };
      }
      return args;
    },
    response: async (response) => {
      return response;
    },
  },
});
