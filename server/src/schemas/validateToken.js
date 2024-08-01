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
      required: ['valid'],
      properties: {
        valid: { type: 'boolean' },
        data: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};
