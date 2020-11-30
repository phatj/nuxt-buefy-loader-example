const programmaticComponents = [
  'Dialog',
  'Loading',
  'Modal',
  'Notification',
  'Snackbar',
  'Toast',
];

const defaultBuefyOptions = {
  css: false,
  materialDesignIcons: true,
  materialDesignIconsHRef:
    'https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css',
};

export const createOptions = (components = [], buefy = {}) => {
  return {
    buefy: {
      ...defaultBuefyOptions,
      ...buefy,
    },
    components: components.concat(programmaticComponents),
  };
};
