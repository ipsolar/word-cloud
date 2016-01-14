import React from 'react';
import ReactDOM from 'react-dom';
import WordCloud from '../../chart/wordcloud';
import KeywordInContext from 'keyword-in-context'

import '../../chart/wordcloud.css';

/**
 * Contains UI for the main configuration options that
 * modify the visualization.
 */
 export default class WordCloudComponent extends React.Component {

   constructor() {
     super()
     this.state = {
       kwikQuery: 'she'
     };
   }

  componentDidMount() {
    this.chart = new WordCloud({
      container: ReactDOM.findDOMNode(this).firstChild
    });

    this.chart.initialRender();
    this.chart.update(this.props.data, this.props.config);
    this.chart.render();

    // Listen to interaction events from the vis.
  }

  componentDidUpdate() {
    this.chart.update(this.props.data, this.props.config);
    this.chart.render();
  }

  render() {
    var query = this.state.kwikQuery;

    var kwiks = this.props.kwikData.map((kwikDatum) => {
      return <KeywordInContext
        key={kwikDatum.id}
        caseSensitive={true}
        contextSize={30}
        text={kwikDatum.text}
        query={query}
      />;
    });

    return (
      <div>
        <div className='kwik-container'></div>
        {kwiks}
      </div>
    );
  }
}

WordCloudComponent.propTypes = {
  // document properties here.
  config: React.PropTypes.object.isRequired,
  data: React.PropTypes.array.isRequired,
  kwikData: React.PropTypes.array
};
