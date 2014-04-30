Major Requirements Visualizer (MRV)
===================================

A Javascript tool using jsPlumb that depicts a student's progress in covering course requirements.

## Immediate Demo Use

  Unfortunately, since JSON data is required, users will need to temporarily allow files to access other local files. This generally involves opening a fresh instance of the browser with the "--allow-file-access-from-files" flag. As this can lead to security issues on continued browser use with this flag enabled, it is recommended to restart your browser after use.

Directions for:

- [Safari, Chrome, and Internet Explorer](https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally#change-local-files-security-policy)

- Internet Explorer

Internet Options>Advanced tab, security section, check "Allow active content to run in files on My Computer"

After the browser has been initialized, open "index.html.""

## Project Structure

The MRV demo can be found in the base directory of the project as "index.html" alongside other custom JavaScript and CSS files. Most dependencies are found in the jsPlumb folder in either jsPlumb/lib/ or jsPlumb/src/.

## Requirements

- [jsPlumb](https://github.com/sporritt/jsPlumb/)

jsPlumb is necessary to connect DOM elements. The version most recently tested is 1.5.5


