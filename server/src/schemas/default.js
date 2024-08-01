module.exports = {
  headers: {
    type: 'object',
    properties: {
      authorization: { type: 'string' },
    },
    required: ['authorization'],
  },
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: {
        data: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};
