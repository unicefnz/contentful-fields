import { FieldExtensionSDK, init, locations } from 'contentful-ui-extensions-sdk';
import './index.css';
import resizeIFrame, { debounce } from './util';

interface ValidEmbed {
  valid: true;
  url: string;
  html: string;
  description: string | null;
}
type MaybeEmbed = ValidEmbed | { valid: false } | null;

interface OEmbed {
  url?: string;
  html?: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

function loadElement(sdk: FieldExtensionSDK, root: HTMLDivElement) {
  const { iframelyKey } = sdk.parameters.installation as any;
  let currentValue: MaybeEmbed = sdk.field.getValue();

  async function setValue(value: MaybeEmbed) {
    currentValue = value;
    await sdk.field.setValue(value);
  }

  function render(embedOrStr: string | ValidEmbed) {
    if (typeof embedOrStr === 'string') {
      root.innerHTML = embedOrStr;
    } else if (embedOrStr.valid) {
      // Render a valid embed
      const frame = document.createElement('iframe');
      frame.srcdoc = embedOrStr.html;
      frame.className = 'preview-iframe';

      root.innerHTML = '';
      root.appendChild(frame);

      resizeIFrame(frame);
    }
  }

  async function fetchEmbed(url: string): Promise<ValidEmbed> {
    console.debug('Calling API');
    const r = await fetch(`https://cdn.iframe.ly/api/oembed?api_key=${iframelyKey}&url=${encodeURIComponent(url)}`);

    const resp = await r.json() as OEmbed;
    if (!resp.url || !resp.html) throw new Error('Unexpected Response');

    return {
      valid: true,
      url: resp.url,
      html: resp.html,
      description: resp.description || null
    };
  }

  function onUrlChange(newUrl: string) {
    if (
      // If it was null and is still null
      (!newUrl && !currentValue?.valid)
      // If the last URL matches the current URL
      || (currentValue?.valid && newUrl === currentValue.url)) {
      // Nothing has changed
      root.classList.remove('loading');
      return;
    }

    if (newUrl) {
      fetchEmbed(newUrl).then((e) => {
        setValue(e);
        render(e);
        root.classList.remove('loading');
      }).catch((e) => {
        setValue({ valid: false });
        render(`<strong style="color: #A00">Error loading the embed: ${e.name}</strong>`);
        root.classList.remove('loading');
      });
    } else {
      render('<p>Please set a URL</p>');
      root.classList.remove('loading');
      setValue({ valid: false });
    }
  }

  // Start resizing the thing? Idk
  sdk.window.startAutoResizer();

  root.innerHTML = '<p>Loading...</p>';

  if (!iframelyKey) return render('<strong style="color: #A00">No Iframely key has been set! Please configure the installation settings.</strong>');

  // Try to find a reference to the URL field on this entry
  const urlFieldName = (sdk.parameters.instance as any).urlFieldId || 'url';

  const urlField = sdk.entry.fields[urlFieldName];
  if (!urlField) return render(`<strong style="color: #A00">Couldn't find a URL field called \`${urlFieldName}\`</strong>`);

  // Respond to URL changes
  const debouncedUpdate = debounce(onUrlChange, 500);
  function urlFieldChange(value: string) {
    root.classList.add('loading');
    debouncedUpdate(value);
  }
  urlField.onValueChanged(value => urlFieldChange(value));

  if (currentValue?.valid) {
    render(currentValue);
  } else render('<p>Please set a URL</p>');
}

init((sdk) => {
  const root = document.querySelector('#root') as HTMLDivElement;

  if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    loadElement(sdk as FieldExtensionSDK, root);
  } else {
    root.innerHTML = '<p>The extension cannot be rendered in this location</p>';
  }
});
