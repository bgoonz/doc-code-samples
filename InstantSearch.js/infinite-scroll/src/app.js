/* global instantsearch algoliasearch */

let lastRenderArgs;

const infiniteHits = instantsearch.connectors.connectInfiniteHits(
  (renderArgs, isFirstRender) => {
    const { hits, showMore, widgetParams } = renderArgs;
    const { container } = widgetParams;

    lastRenderArgs = renderArgs;

    if (isFirstRender) {
      const sentinel = document.createElement('div');
      container.appendChild(document.createElement('ul'));
      container.appendChild(sentinel);

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !lastRenderArgs.isLastPage) {
            showMore();
          }
        });
      });

      observer.observe(sentinel);

      return;
    }

    container.querySelector('ul').innerHTML = hits
      .map(
        hit =>
          `<li>
            <div class="ais-Hits-item">
              <header class="hit-name">
                ${hit._highlightResult.name.value}
              </header>
              <img src="${hit.image}" align="left" />
              <p class="hit-description">
                ${hit._highlightResult.description.value}
              </p>
              <p class="hit-price">$${hit.price}</p>
            </div>
          </li>`
      )
      .join('');
  }
);

const searchClient = algoliasearch(
  'B1G2GM9NG0',
  'aadef574be1f9252bb48d4ea09b5cfe5'
);

const search = instantsearch({
  indexName: 'demo_ecommerce',
  searchClient,
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  })
);

search.addWidget(
  infiniteHits({
    container: document.querySelector('#hits'),
  })
);

search.start();
