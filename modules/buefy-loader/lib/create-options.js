import * as Components from 'buefy';

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
  const validComponentNames = Object.keys(Components).filter((name) =>
    name.match(/^[A-Z]/)
  );
  const filteredComponents = components
    .concat(programmaticComponents)
    .filter((name) => validComponentNames.includes(name));

  return {
    buefy: {
      ...defaultBuefyOptions,
      ...buefy,
    },
    components: Array.from(new Set(filteredComponents)),
  };
};
