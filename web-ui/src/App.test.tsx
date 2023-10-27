import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { PluginManager } from '@sop-workflow-tracker/react-plugin-engine';

test('renders learn react link', () => {
  const pluginManager = new PluginManager();
  render(<App pluginManager={pluginManager}/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
