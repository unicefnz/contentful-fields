import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { SingleLineEditor } from '@contentful/field-editor-single-line';
import { RichTextEditor } from '@contentful/field-editor-rich-text';
import { init, FieldExtensionSDK, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

interface AppProps {
  sdk: FieldExtensionSDK;
}

export const App = ({ sdk }: AppProps) => {
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const matchMode = (sdk.parameters.instance as any).mode;
  const matchField = (sdk.parameters.instance as any).field;
  const matchValue = (sdk.parameters.instance as any).value;

  function onTargetChange(value: string) {
    const disableOnMatch = matchMode === 'hide';
    if (value === matchValue) setDisabled(disableOnMatch);
    else setDisabled(!disableOnMatch);
  }

  useEffect(() => {
    sdk.window.startAutoResizer();

    // Find target field
    const target = sdk.entry.fields[matchField];
    if (!target) return setError(`Couldn't find target field ${matchField}`);

    const remove = target.onValueChanged(value => onTargetChange(value));
    return () => remove();
  }, []);

  if (!matchMode) return (<p>Match Mode must be configured</p>);
  if (disabled) return (
    <p className="smallText">{[
      'This field is disabled because',
      sdk.contentType.fields.find(f => f.id === matchField)?.name,
      matchMode === 'hide' ? 'is' : 'isn\'t',
      matchValue
    ].join(' ')}</p>
  );

  if (error) return <p>{error}</p>;

  if (sdk.field.type === 'Symbol') {
    return <SingleLineEditor isInitiallyDisabled={false} field={sdk.field} locales={sdk.locales} />
  } else if (sdk.field.type === 'RichText') {
    return <RichTextEditor sdk={sdk} />
  } else return <p>This field type is not supported</p>;
};

init((sdk) => {
  if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
  } else {
    render(<p>The extension cannot be rendered in this location</p>, document.getElementById('root'));
  }
});

// if (module.hot) {
//   module.hot.accept();
// }
