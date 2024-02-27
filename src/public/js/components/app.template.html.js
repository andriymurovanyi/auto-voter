export const AppTemplate = () => `
  <div v-if="!pageLoading" class="container mt-5">
    <div class="d-flex justify-content-between align-items-center">
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
          <th>Artist</th>
          <th>Song</th>
          <th>Votes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredStatistics" :key="item.song">
          <td>{{ item.artist }}</td>
          <td>{{ item.song }}</td>
          <td>{{ item.votesAmount }}</td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex w-100 justify-content-center align-items-center">
      <Pagination
        :total-items="pagination.totalItems"
        :current-page="pagination.currentPage"
        :items-per-page="pagination.itemsPerPage"
      />
    </div>
  </div>
`;
