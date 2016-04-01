const GRAPHIQL_VERSION = '0.3.1';

// TODO default query
// const defaultQuery = ``;
export function renderGraphiQL({ query, variables, version = GRAPHIQL_VERSION } = {}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <link href="//cdn.jsdelivr.net/graphiql/${version}/graphiql.css" rel="stylesheet" />
        <script src="//cdn.jsdelivr.net/fetch/0.9.0/fetch.min.js"></script>
        <script src="//cdn.jsdelivr.net/react/0.14.1/react.min.js"></script>
        <script src="//cdn.jsdelivr.net/graphiql/${version}/graphiql.min.js"></script>
      </head>
      <body>
        Loading...
        <script>
          /**
           * This GraphiQL example illustrates how to use some of GraphiQL's props
           * in order to enable reading and updating the URL parameters, making
           * link sharing of queries a little bit easier.
           *
           * This is only one example of this kind of feature, GraphiQL exposes
           * various React params to enable interesting integrations.
           */
          // Parse the search string to get url parameters.
          var search = window.location.search;
          var parameters = {};
          search.substr(1).split('&').forEach(function (entry) {
            var eq = entry.indexOf('=');
            if (eq >= 0) {
              parameters[decodeURIComponent(entry.slice(0, eq))] =
                decodeURIComponent(entry.slice(eq + 1));
            }
          });
          // if variables was provided, try to format it.
          if (parameters.variables) {
            try {
              parameters.variables =
                JSON.stringify(JSON.parse(parameters.variables), null, 2);
            } catch (e) {
              // Do nothing, we want to display the invalid JSON as a string, rather
              // than present an error.
            }
          }
          // When the query and variables string is edited, update the URL bar so
          // that it can be easily shared
          function onEditQuery(newQuery) {
            parameters.query = newQuery;
            updateURL();
          }
          function onEditVariables(newVariables) {
            parameters.variables = newVariables;
            updateURL();
          }
          function updateURL() {
            var newSearch = '?' + Object.keys(parameters).map(function (key) {
              return encodeURIComponent(key) + '=' +
                encodeURIComponent(parameters[key]);
            }).join('&');
            history.replaceState(null, null, newSearch);
          }
          // Defines a GraphQL fetcher using the fetch API.
          function graphQLFetcher(graphQLParams) {
            return fetch(window.location.origin + '/api/graphql', {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(graphQLParams),
            }).then(function (response) {
              return response.json()
            });
          }
          // Render <GraphiQL /> into the body.
          React.render(
            React.createElement(GraphiQL, {
              fetcher: graphQLFetcher,
              query: ${query ? `\`${query}\`` : '\'\''},
              variables: ${variables ? `\`${variables}\`` : '\'\''},
              onEditQuery: onEditQuery,
              onEditVariables: onEditVariables
            }),
            document.body
          );
        </script>
      </body>
    </html>`;
}