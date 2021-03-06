import React from 'react'; //eslint-disable-line
import ReactDOM from 'react-dom';
import WordCloud from './components/wordcloud/wordcloud.jsx';

import './demo.html';
import './demo.css';

// This will render out an an example of wordcloud

import data from '../data/data.json';
import kwicData from '../data/kwic_data.json';
import config from '../data/config.json';

document.addEventListener("DOMContentLoaded", function() {
  ReactDOM.render(
    <WordCloud
      config={config}
      data={data}
      kwicData={kwicData}
    />,
    document.querySelector("#main"));
});
