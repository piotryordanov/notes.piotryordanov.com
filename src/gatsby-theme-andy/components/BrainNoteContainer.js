import React from 'react';
import { Link } from 'gatsby';
import { useStackedPagesProvider, LinkToStacked } from 'react-stacked-pages-hook';
import { Helmet } from 'react-helmet';

import BrainNote from './BrainNote';

import '../../style.css';

const NOTE_WIDTH = 1024; // w-xl

// A wrapper component to render the content of a page when stacked
const StackedPageWrapper = ({
  PageIndexProvider,
  children,
  slug,
  title,
  overlay,
  obstructed,
  i,
}) => (
  <PageIndexProvider value={i}>
    <div
      className={`mx-auto border rounded shadow-xs max-w-5xl note-container  px-4 bg-white md:sticky flex flex-col flex-shrink-0 ${
        overlay ? 'shadow-lg' : ''
      }`}
      style={{ left: 0, right: 0, width: NOTE_WIDTH}}
    >
      <div
        className={`md:block hidden transition-opacity duration-100 ${
          obstructed ? `opacity-100` : `opacity-0`
        }`}
      >
        <div className={`transform rotate-90 origin-left pb-4 absolute z-10`}>
          <LinkToStacked to={slug} className="no-underline text-gray-900">
            <p className="m-0 font-bold">{title || slug}</p>
          </LinkToStacked>
        </div>
      </div>
      <div
        className={`flex flex-col min-h-full transition-opacity duration-100 ${
          obstructed ? `opacity-0` : `opacity-100`
        }`}
      >
        {children}
      </div>
    </div>
  </PageIndexProvider>
);

const BrainNotesContainer = ({ slug, note, location, siteMetadata }) => {
  // process data from gatsby pageQuery API
  const processPageQuery = React.useCallback((x) => x.json.data.brainNote, []);
  const [
    stackedPages,
    stackedPageStates,
    navigateToStackedPage,
    ContextProvider,
    PageIndexProvider,
    scrollContainer,
  ] = useStackedPagesProvider({
    firstPageSlug: slug,
    location,
    processPageQuery,
    pageWidth: NOTE_WIDTH,
  });

  return (
    <div className="text-gray-900 flex flex-col min-h-screen h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Gentium+Book+Basic:ital,wght@0,400;0,700;1,400;1,700&family=Lato&display=swap" rel="stylesheet"></link>
        <title>
          {note.title} - {siteMetadata.title}
        </title>
      </Helmet>
      <header>
        <div className="fixed w-full z-50 bg-white shadow font-bold py-2 border-b px-4">
          <div className="px-4 m-auto" style={{maxWidth: "1024px"}}>
            <Link to="/" className="no-underline text-gray-900">
              {siteMetadata.title}
            </Link>
            <a href="https://piotryordanov.com" className="no-underline text-gray-900 float-right">
              About Me
            </a>
          </div>
        </div>
      </header>

      <div
        // className="flex-1 flex flex-grow overflow-x-hidden md:overflow-x-auto overflow-y-hidden"
        ref={scrollContainer}
      >
        <div
          className="my-20 mx-auto note-columns-container flex flex-grow transition-width duration-100"
          style={{ width: NOTE_WIDTH * (stackedPages.length + 1) }}
        >
          <ContextProvider value={{ stackedPages, navigateToStackedPage }}>
            {/* Render the first page */}
            <StackedPageWrapper
              PageIndexProvider={PageIndexProvider}
              i={0}
              slug={slug}
              title={note.title}
              overlay={stackedPageStates[slug] && stackedPageStates[slug].overlay}
              obstructed={stackedPageStates[slug] && stackedPageStates[slug].obstructed}
            >
              <BrainNote note={note} />
            </StackedPageWrapper>

            {/* Render the stacked pages */}
            {stackedPages.map((page, i) => (
              <StackedPageWrapper
                PageIndexProvider={PageIndexProvider}
                i={i + 1}
                key={page.slug}
                slug={page.slug}
                title={page.data.title}
                overlay={stackedPageStates[page.slug] && stackedPageStates[page.slug].overlay}
                obstructed={stackedPageStates[page.slug] && stackedPageStates[page.slug].obstructed}
              >
                <BrainNote note={page.data} />
              </StackedPageWrapper>
            ))}
          </ContextProvider>
        </div>
      </div>
    </div>
  );
};

export default BrainNotesContainer;
