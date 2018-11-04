module.exports = {
  coverageDirectory: 'reports/',
  coverageReporters: ['text', 'html'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        output: 'reports/junit.xml',
      },
    ],
  ],
}
