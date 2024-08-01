module.exports = {
  headers: {
    type: 'object',
    properties: {
      'x-session-id': { type: 'string' },
    },
    required: ['x-session-id'],
  },
  response: {
    default: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          default: true,
        },
      },
    },
    200: {
      type: 'object',
      properties: {
        data: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};
