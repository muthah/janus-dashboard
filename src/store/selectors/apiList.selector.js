import { createSelector } from 'reselect';

const getApiList = state => state.apiListReducer.apiList;
const getSearchQuery = state => state.searchReducer.searchQuery;

const getFilteredApiList = (apiList, searchQuery) => {
  return apiList.filter(el => {
    if (el.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return el;
    }
  });
};

export const filteredApiList = createSelector(
  getApiList,
  getSearchQuery,
  getFilteredApiList,
);
