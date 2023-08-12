import { SWRConfiguration } from 'swr';

const swrOptions: SWRConfiguration = {
  revalidateOnFocus: false,
  onErrorRetry: (error) => {
    if (error.response.status === 401) return;
  },
};

export default swrOptions;
