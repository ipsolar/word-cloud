import React from 'react';
import ReactDOM from 'react-dom';
import WordCloud from '../../chart/wordcloud';
import {KeywordInContext} from 'keyword-in-context';

import '../../chart/wordcloud.css';
import './wordcloud.css';

/**
 * Contains UI for the main configuration options that
 * modify the visualization.
 */
 export default class WordCloudComponent extends React.Component {

   constructor() {
     super();
     this.state = {
       kwicQuery: '',
       kwicText: '',
       selectedNode: ''
     };
   }

   // An event handler for when a word is selected in a word cloud
   selected(token, documentId, node) {
     var text = this.props.kwicData.find((d) => d.id === documentId).text;
     this.setState({
       'kwicQuery': token,
       'kwicText': text,
       'selectedNode': node
     });
   }

  componentDidMount() {
    this.chart = new WordCloud({
      container: ReactDOM.findDOMNode(this).querySelector('.cloud-container')
    });

    this.chart.initialRender();
    this.chart.update(this.props.data, this.props.config);
    this.chart.render();

    // Listen to interaction events from the vis.
    this.chart.on('select', this.selected.bind(this));
  }

  componentDidUpdate() {
    this.chart.update(this.props.data, this.props.config);
    this.chart.render();
  }

  getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    };
  }

  popover(style, content, onclose) {
    return (<div style={style}>
      <div className='controls'>
        <button onClick={onclose}>close</button>
      </div>
      <div>
        {content}
      </div>
    </div>);
  }

  renderKeywordInContext() {
    var kwic;
    var kwicPosition;
    if(this.state.selectedNode) {
      let nodeOffset = this.getOffset(this.state.selectedNode);
      kwicPosition = {
        position: 'absolute;',
        top: nodeOffset.top + nodeOffset.height,
        left: nodeOffset.left,
        zIndex: 100
      };

      kwic = <div>
        <KeywordInContext
          caseSensitive={this.props.config.kwicCaseSensitive}
          contextSize={this.props.config.kwicContextSize}
          limit={this.props.config.kwicLimit}
          text={this.state.kwicText}
          query={this.state.kwicQuery}
        />
      </div>;
      return this.popover(kwicPosition, kwic, () => {
        this.setState({selectedNode: undefined});
      });
    }
  }

  render() {
    return (
      <div>
        <div className='cloud-container'></div>
        {this.renderKeywordInContext()}
      </div>
    );
  }
}

WordCloudComponent.propTypes = {
  // document properties here.
  config: React.PropTypes.object.isRequired,
  data: React.PropTypes.array.isRequired,
  kwicData: React.PropTypes.array
};

WordCloudComponent.defaultProps = {
  kwicData: []
};

/**
 * Helper method for instatiating this method imperatively
 * (as opposed to declaratively with React.)
 *
 * @param  {Object} opts display parameters.
 * @param  {Object} opts.config
 * @param  {Array} opts.data
 * @param  {Array} opts.kwicData
 * @param  {DOMNode} opts.container
 * @param  {String} opts.query
 *
 */
WordCloudComponent.show = function(opts) {
  var config = opts.config;
  var data = opts.data;
  var kwicData = opts.kwicData;
  var container = opts.container;

  ReactDOM.render(
    <WordCloudComponent
      config={config}
      data={data}
      kwicData={kwicData}
    />,
    container
  );

};
