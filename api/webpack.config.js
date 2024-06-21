const path = require('path');
module.exports = function (options, webpack) {
  return {
    ...options,
    watchOptions: {
      ignored: [
        path.resolve(__dirname, 'dist'),
        path.resolve(__dirname, 'node_modules'),
      ],
      poll: 2000,
    },
  };
};
