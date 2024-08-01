module.exports = {
  body: {
    type: 'object',
    required: ['payload'],
    properties: {
      payload: { type: 'string' },
    },
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
    201: {
      type: 'object',
      properties: {
        data: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};
