import React from 'react';
import { observer, inject } from 'mobx-react';

const Language = ({ language, resource, params }) => {
  const selectedResource = language.getText(resource);
  let text = selectedResource;
  if (typeof selectedResource === 'function') {
    text = selectedResource(params);
  }

  return ( 
    <span>{text}</span>
  );
}

export default inject('language')(observer(Language));
