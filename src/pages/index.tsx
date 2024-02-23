import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';

import PopularExperience from '@/components/Home/PopularExperience/PopularExperience';
import Searchbar from '@/components/Home/Searchbar/Searchbar';
import AllExperience from '@/components/Home/AllExperience/AllExperience';
import Banner from '@/components/Home/Banner/Banner';
import NoResult from '@/components/common/NoResult/NoResult';
import { getActivities } from '@/api/activities';
import { setContext } from '@/api/axiosInstance';
import QUERY_KEYS from '@/constants/queryKeys';
import styles from './Home.module.css';
import { useHome } from '@/hooks/Home/useHome';

export const getServerSideProps: GetServerSideProps = async (context) => {
  setContext(context);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.popularActivities],
    queryFn: () => getActivities({ method: 'cursor', sort: 'most_reviewed', size: 10 }),
  });

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
};

function Home() {
  const {
    handleSearchSubmit,
    handleSearchText,
    inputSearchText,
    recentSearchKeywords,
    searchResult,
    priceFilterValue,
    setPriceFilterValue,
    selectedCategory,
    handleClickCategory,
    currentPageNumber,
    totalPageNumber,
    handlePaginationByClick,
    activityData,
    searchedByNoData,
    isFetching,
    handleDeleteRecentSearch,
  } = useHome();

  return (
    <main className={styles.container}>
      <Banner />
      <div className={styles.mainWrapper}>
        <Searchbar
          handleSearchSubmit={handleSearchSubmit}
          handleSearchText={handleSearchText}
          inputSearchText={inputSearchText}
          recentText={recentSearchKeywords}
          handleDeleteRecentSearch={handleDeleteRecentSearch}
        />
        {!searchResult && <PopularExperience />}

        {!searchedByNoData && activityData && (
          <AllExperience
            searchResult={searchResult}
            showCards={activityData.activities}
            totalCardsNum={activityData.totalCount}
            handlePaginationByClick={handlePaginationByClick}
            totalPages={totalPageNumber}
            pageNumber={currentPageNumber}
            handleClickCategory={handleClickCategory}
            selectedCategory={selectedCategory}
            setPriceFilterValue={setPriceFilterValue}
            priceFilterValue={priceFilterValue}
          />
        )}
        {searchedByNoData && (
          <div className={styles.noResultContainer}>
            <NoResult />
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
