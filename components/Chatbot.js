/* eslint-disable require-jsdoc */
import React, {Component} from 'react';

class Chatbot extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    (function(d, m) {
      const kommunicateSettings =
            {'appId': '15c8416d429e73e551642383e0a1c4fdd', 'popupWidget': true, 'automaticChatOpenOnNavigation': true};
      const s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;
      s.src = 'https://widget.kommunicate.io/v2/kommunicate.app';
      const h = document.getElementsByTagName('head')[0]; h.appendChild(s);
      window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
  }
  render() {
    return (
      <div></div>
    );
  }
}

export default Chatbot;
