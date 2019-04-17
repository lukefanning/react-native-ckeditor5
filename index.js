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
    onChange: propTypes.func,
    initialData: propTypes.string,
    maxHeight: propTypes.number,
    editorConfig: propTypes.object,
    style: propTypes.object,
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
    console.log('Data from ckeditor:', data);
    this.props.onChange(data);
  };

  render() {
    const { maxHeight, editorConfig, style, initialData, renderLoading } = this.props;
    return (
      <WebView
        ref={c => this.webview = c}
        style={style}
        scrollEnabled={false}
        source={{html: `
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
              max-height: ${maxHeight || 100}px;
          }
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
        injectedJavaScript={initialData ? `window.editor.setData('${initialData}'); true;` : null}
        onMessage={this.onMessage}
        renderLoading={renderLoading}
      />
    );
  }
}

export default CKEditor5;
