import NewsArticlesGrid from '@/components/NewsArticlesGrid';
import { NewsArticle, NewsResponse } from '@/models/NewsArticles';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Alert } from 'react-bootstrap';

interface CategoryNewsPageProps {
  newsArticles: NewsArticle[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  // categorySlugs does not need to be hardcoded here. Instead, you could do another fetch request to get the categories from the api
  const categorySlugs = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];

  const paths = categorySlugs.map((slug) => ({
    params: { category: slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<CategoryNewsPageProps> = async ({
  params,
}) => {
  const category = params?.category?.toString();
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`
  );

  const newsResponse: NewsResponse = await response.json();
  return {
    props: { newsArticles: newsResponse.articles },
    // Incremental Static Regeneration: implemented using the `revalidate` field below. THis is a good middle ground between getServerSideProps and getStaticProps because the data updates based on the interval, which keeps it up to date and only one user gets a long reload at the start of each new revalidate period.
    revalidate: 5 * 60,
  };
};

const CategoryNewsPage = ({ newsArticles }: CategoryNewsPageProps) => {
  const router = useRouter();
  const categoryName = router.query.category?.toString();
  const title = 'Category: ' + categoryName;

  return (
    <>
      <Head>
        <title key="title">{`${title} - NextJS News App`}</title>
      </Head>
      <main>
        <h1>{title}</h1>
        <Alert>
          This is page uses <strong>getStaticProps</strong> for very high page
          loading speed and <strong>incremental static regeneration</strong> to
          show data not older than <strong>5 minutes</strong>.
        </Alert>
        <NewsArticlesGrid articles={newsArticles} />
      </main>
    </>
  );
};
export default CategoryNewsPage;
