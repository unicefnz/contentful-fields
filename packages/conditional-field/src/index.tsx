import * as React from 'react';
import { render } from 'react-dom';
import { } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { useEffect, useState } from 'react';

interface AppProps {
  sdk: FieldExtensionSDK;
}

export const App = ({ sdk }: AppProps) => {
  const [value, setValue] = useState();

  useEffect(() => {
    sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    const detatch = sdk.field.onValueChanged(val => setValue(val));
    return () => detatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <h1>Hello!</h1>
  );
};

init((sdk) => {
  if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
  } else {
    render(<p>The extension cannot be rendered in this location</p>, document.getElementById('root'));
  }
});

if (module.hot) {
  module.hot.accept();
}
