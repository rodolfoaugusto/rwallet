module.exports = {
  headers: {
    type: 'object',
    properties: {
      authorization: { type: 'string' },
    },
    required: ['authorization'],
  },
  response: {
    202: {
      type: 'object',
      required: ['data'],
      properties: {
        data: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};
