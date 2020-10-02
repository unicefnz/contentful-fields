# Rich Embed Renderer
This UI Extension allows you to embed content from anywhere on the internet into your posts using
[Iframely](https://iframely.com/). It does this by looking for another URL field in your entry,
fetching an embed from there, and storing the metadata (Such as html, url, and title)

## Installation
Follow the steps in [the main README](/README.md) and then configure your fields.

Find the field you want to store the embed metadata and render the preview.
Select Settings > Appearance > Rich Embed Renderer

### Config

Installation

- iframelyKey: This is required to configure access to Iframely's APIs

Field

- urlField: The ID of the field that contains the embed URL. Defaults to `url`
