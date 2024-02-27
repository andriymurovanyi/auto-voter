/**
 * Pagination function.
 *
 * @param {number} currentPage
 * @param {number} perPage
 * @param {*[]} items
 *
 * @return {*[]} Current page items
 */
export function getPageData({
  items,
  currentPage,
  perPage,
}) {
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = currentPage * perPage;

  return items.slice(startIndex, endIndex);
}
