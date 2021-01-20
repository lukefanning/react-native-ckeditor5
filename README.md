# react-native-ckeditor5

#### React Native CKEditor5 component wrapper

## Installation

```
yarn add react-native-ckeditor5
```

or

```
npm install --save react-native-ckeditor5
```

and then

```jsx harmony
import CKEditor5 from 'react-native-ckeditor5';
```

## Usage

Creating a CKEditor5 editor:

```jsx harmony
const colors = {
  backgroundColor: '{your color code here}',
  offContentBackgroundColor: '{your secondary color code here}',
  color: '{font color code here}',
  bg5: '{your toolbar button active and hover color}'
}
```

```jsx harmony
     <CKEditor5
        initialData={inputValue}
        onChange={value => onTextChange(value)}
        editorConfig={{ toolbar: ['bold', 'italic', 'underline', 'bulletedList', 'numberedList', '|', 'undo', 'redo'] }}
        onFocus={() => {}}
        onBlur={() => {}}
        fontFamily={device.isIOS ? "-apple-system, 'Helvetica Neue', 'Lucida Grande'" : "'Roboto', sans-serif"}
        style={{ backgroundColor: 'transparent' }}
        height={utils.scaleByVertical(685)}
        colors={colors}
        toolbarBorderSize="0px"
        editorFocusBorderSize="0px"
      />
```
