# Show server IP
Show server IP when hovering over the icon in the browser address bar and copy it to the clipboard when clicking.

For faster IP display on hover open `about:config` and add the preference `ui.tooltipDelay` with the type `Number` and the value `100` (default is [500](https://developer.mozilla.org/en-US/docs/Mozilla/Preferences/Preference_reference/ui.tooltipDelay)).

To adapt the icon color to the theme color open `about:config`, find option `svg.context-properties.content.enabled` and change it to `true`. See [bug #1377302](https://bugzilla.mozilla.org/show_bug.cgi?id=1377302).
