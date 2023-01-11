let url = '';

if (import.meta.env.MODE == 'production') {
  url = import.meta.env.VITE_PRODUCTION_URL;
}

export default url;
