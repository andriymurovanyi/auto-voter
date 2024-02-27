export const AppTemplate = () => `
  <div v-if="!pageLoading" class="container mt-5">
    <div class="toolbar">
      <div class="search-wrapper">
        <input
          type="text"
          v-model="search"
          class="form-control mb-3"
          placeholder="Search by artist or song..."
        >
      </div>

      <p>Last sync: {{ lastSyncDate }}</p>
    </div>

    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>Position</th>
          <th>Artist</th>
          <th>Song</th>
          <th>Votes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedStatistics" :key="item.song + index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.artist }}</td>
          <td>{{ item.song }}</td>
          <td>{{ item.votesAmount }}</td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex w-100 justify-content-center align-items-center">
      <Pagination
        :total-items="pagination.total"
        :current-page="pagination.currentPage"
        :items-per-page="pagination.perPage"
        @page-change="onPageChange"
      />
    </div>
  </div>
`;
