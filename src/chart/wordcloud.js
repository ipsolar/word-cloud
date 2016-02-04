import d3 from 'd3';
import _ from 'lodash';

export default class WordCloud {
  constructor(opts) {
    this.opts = opts;
    this._container = opts.container;;
    this.container = d3.select(this._container);

    this.dispatch = d3.dispatch('select');
  }

  updateData(data) {
    this.documents = _.cloneDeep(data);
    this.documents.forEach((document) => {
      document.tokens = _.sortBy(document.tokens, (t) => -t[1]);
    });

    // Create an array of maps that go from token -> score for each
    // document in the data. Also keep track of how many documets each
    // term appears in.
    var documentAppearances = {};
    var documentScores = this.documents.map((document) => {
      var scores = document.tokens.reduce((map, [token, score]) => {
        var currAppearences = documentAppearances[token] || 0;
        documentAppearances[token] = currAppearences + 1;

        map[token] = score;
        return map;
      }, {});
      return scores;
    });

    // Create a map of all tokens to the sum of the scores in all the documents
    this.sumScores = _.mergeWith({}, ...documentScores, (a, b) => {
      if(a !== undefined && b !== undefined){
        return a + b;
      }
      return undefined;
    });

    // Store the set of unique terms
    this.uniqueTokens = new Set();
    for (let key of Object.keys(documentAppearances)) {
      let count = documentAppearances[key];
      if (count === 1) {
        this.uniqueTokens = this.uniqueTokens.add(key);
      }
    }
  }

  updateScales() {
    this.fontSize = d3.scale.linear()
      .domain(d3.extent(_.values(this.sumScores)))
      .range([12, 64]);
  }

  update(data) {
    this.updateData(data);
    this.updateScales();
  }

  initialRender() {
    // No-op
  }

  render() {
    var self = this;

    var wordCloud = this.container.selectAll('div.word-cloud-plot')
      .data(this.documents);

    var plot = wordCloud.enter()
      .append('div')
      .attr('class', 'word-cloud-plot');

    plot
      .append('div')
      .attr('class', 'title')
      .text((d) => d.name);

    plot
      .append('div')
      .attr('class', 'cloud');

    var tokens = plot.select('.cloud').selectAll('.tokens')
      .data((d) => d.tokens, (d) => d[0]);

    var token = tokens.enter()
      .append('span')
      .attr('class', 'token')
      .on('click', function(d) {
        var docId = this.parentNode.parentNode.__data__.id;
        var token = d[0];
        self.dispatch.select(token, docId, this);
      });

    token
      .append('span')
        .attr('class', 'token-term')
        .classed('unique', (d) => this.uniqueTokens.has(d[0]))
        .style('font-size', (d) => this.fontSize(d[1]) + 'px')
        .text((d) => d[0])
      .append('sup')
        .attr('class', 'token-score')
        .text((d) => d[1]);


    tokens.exit().remove();
    wordCloud.exit().remove();

  }

  on(event, callback) {
    this.dispatch.on(event, callback);
  }

}
