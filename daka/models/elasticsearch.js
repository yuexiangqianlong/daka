var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
	host: 'localhost:9200'
});

var indexName = "pserson";

function getSuggestions(input) {
	return elasticClient.search({
		index: indexName,
		body: {
			query: {
				multi_match: {
					query: input,
					lenient: "true", // --ignore values that don't fit specific fields
					fields: ["name", "score", "classes^2", "phone", "frequency"]
				}
			}
		}
	}) // .then(function (response) {
	// var hits = response.hits.hits;
	// console.log(response);
	//  });
}
exports.getSuggestions = getSuggestions;