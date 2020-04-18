import React from 'react';
import ReactDOM from 'react-dom';
import DataEdit from './DataEdit';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DataEdit />, div);
  ReactDOM.unmountComponentAtNode(div);
});
