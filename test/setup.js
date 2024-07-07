import '@testing-library/jest-dom';
import { beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/preact';

beforeEach(() => {
  // Esegui il cleanup prima di ogni test
  document.body.innerHTML = '<div id="cookie-banner-container"></div>';
});

afterEach(() => {
  cleanup();
});
