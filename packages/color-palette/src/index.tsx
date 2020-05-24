import * as React from 'react';
import { render } from 'react-dom';
import {
  Dropdown, Button, DropdownListItem, DropdownList
} from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { useEffect, useState } from 'react';

interface AppProps {
  sdk: FieldExtensionSDK;
}

const ColorBox = ({ color }: { color: string }) => (<div className="color-box" style={{ background: color }} />);

export const App = ({ sdk }: AppProps) => {
  const [value, setValue] = useState();
  const [open, setOpen] = useState(false);

  const colors = ((sdk.parameters.instance as any).colors || (sdk.parameters.installation as any).colors || '')
    .split(',')
    .map((c: string) => c.trim())
    .filter((c: string) => !!c);

  useEffect(() => {
    sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    const detatch = sdk.field.onValueChanged(val => setValue(val));
    return () => detatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateValue(newVal: string) {
    setValue(newVal);
    if (newVal) await sdk.field.setValue(newVal);
    else await sdk.field.removeValue();
  }

  return (
    <Dropdown
      isOpen={open}
      onClose={() => setOpen(false)}
      position="bottom-left"
      toggleElement={(
        <Button
          size="small"
          buttonType="muted"
          indicateDropdown
          onClick={() => setOpen(!open)}
        >
          {value ? (<ColorBox color={value} />) : 'Select Color'}
        </Button>
      )}
      dropdownContainerClassName="palette-dropdown-wrapper"
    >
      <DropdownList maxHeight={200}>
        <DropdownListItem isTitle>Select Color</DropdownListItem>
        {colors.length === 0 && <DropdownListItem isDisabled>No colors configured</DropdownListItem>}
        {colors.map((c: string) => (
          <DropdownListItem onClick={() => updateValue(c)} key={c}>
            <ColorBox color={c} /> {c}
          </DropdownListItem>
        ))}
      </DropdownList>
    </Dropdown>
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
