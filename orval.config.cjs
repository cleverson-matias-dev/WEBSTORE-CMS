module.exports = {
  

  // Bounded Context: Catalog
  'catalog-api': {
    input: {
      target: 'http://localhost:8000/docs/catalog/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/gen/catalog/endpoints.ts',
      schemas: './src/api/gen/catalog/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },

  'stock-api': {
    input: {
      target: 'http://localhost:8000/docs/stock/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/gen/stock/endpoints.ts',
      schemas: './src/api/gen/stock/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },

  // Bounded Context: Identity
  'identity-api': {
    input: {
      target: 'http://localhost:8000/docs/identity/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/gen/identity/endpoints.ts',
      schemas: './src/api/gen/identity/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
  
};
