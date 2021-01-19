import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

const ckeditor = require('./ckeditor');

class CKEditor5 extends PureComponent {
  state = {};

  static propTypes = {
    onError: PropTypes.func,
    renderError: PropTypes.func,
    renderLoading: PropTypes.func,
    onChange: PropTypes.func,
    initialData: PropTypes.string,
    maxHeight: PropTypes.number,
    editorConfig: PropTypes.object,
    style: PropTypes.object,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    disableTooltips: PropTypes.bool,
    height: PropTypes.number,
    androidHardwareAccelerationDisabled: PropTypes.bool,
    fontFamily: PropTypes.string,
    colors: PropTypes.object,
    toolbarBorderSize: PropTypes.string,
    editorFocusBorderSize: PropTypes.string
  }

  static defaultProps = {
    height: 150,
  }

  onError = error => {
    if (this.props.onError) {
      this.props.onError(error);
    } else {
      Alert.alert('WebView onError', error, [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]);
    }
  };

  renderError = error => {
    if (this.props.renderError) {
      this.props.renderError(error);
    } else {
      return <Text>Unable to run editor</Text>;
    }
  }

  onMessage = event => {
    const data = event.nativeEvent.data;
    if (data.indexOf('RNCKEditor5') === 0) {
      const [cmdTag, cmd, value] = data.split(':');
      switch (cmd) {
        case 'onFocus':
          if (value === 'true' && this.props.onFocus) this.props.onFocus();
          if (value === 'false' && this.props.onBlur) this.props.onBlur();
          return;
      }
    }
    console.log('Data from ckeditor:', data);
    this.props.onChange(data);
  }

  blur = () => {
    this.webview.injectJavaScript(`document.querySelector( '.ck-editor__editable' ).blur()`);
  }

  render() {
    const {
      maxHeight, editorConfig, style, initialData, renderLoading, disableTooltips, height,
      androidHardwareAccelerationDisabled, fontFamily, colors, toolbarBorderSize, editorFocusBorderSize
    } = this.props;
    return (
      <WebView
        ref={c => this.webview = c}
        style={style}
        scrollEnabled={false}
        source={{baseUrl: Platform.OS === 'android' ? '' : undefined, html: `
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="utf-8">
            <title>CKEditor</title>
            <script>
              ${ckeditor}
            </script>
            <script>
              document.addEventListener("message", function(data) {
                console.log(data.data);
                editor.setData(data.data);
              });
            </script>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <style>
              .ck-editor__editable {
                  height: ${height}px;
                  max-height: ${maxHeight || height}px;
              }
              .ck.ck-editor__main>.ck-editor__editable {
                background: ${colors.backgroundColor};
                color: ${colors.white};
                font-family: ${fontFamily || '-apple-system, "Helvetica Neue", "Lucida Grande"'};
                border-style: none;
              }
              .ck .ck-toolbar {
                background: ${colors.offContentBackground};
                border: ${toolbarBorderSize};
              }
              .ck.ck-reset_all, .ck.ck-reset_all * {
                color: ${colors.white}
              }
              .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
                border: ${editorFocusBorderSize};
              }
              ${disableTooltips ? `
              .ck.ck-button .ck.ck-tooltip {
                  display: none;
              }
              ` : ''}
            </style>
        </head>

        <body>
        <textarea name="editor1" id="editor1"></textarea>
        <script>
        ClassicEditor
            .create( document.querySelector( '#editor1' ), ${JSON.stringify(editorConfig || {})} )
            .then( editor => {
                console.log( editor );
                window.editor = editor;
                editor.model.document.on('change:data', () => {
                  try {
                    window.ReactNativeWebView.postMessage(editor.getData())
                  }
                  catch (e) {
                    alert(e)
                  }
                } );
                editor.editing.view.document.on( 'change:isFocused', ( evt, name, value ) => {
                    console.log( 'editable isFocused =', value );
                    window.ReactNativeWebView.postMessage('RNCKEditor5:onFocus:' + value);
                } );
            } )
            .catch( error => {
                console.error( error );
            } );
        </script>
        </body>

        </html>

        `}}
        onError={this.onError}
        renderError={this.renderError}
        javaScriptEnabled
        injectedJavaScript={initialData ? `window.editor.setData(\`${initialData.replace('\'', '\\\'')}\`); true;` : null}
        onMessage={this.onMessage}
        renderLoading={renderLoading}
        androidHardwareAccelerationDisabled={androidHardwareAccelerationDisabled}
      />
    );
  }
}

export default CKEditor5;
