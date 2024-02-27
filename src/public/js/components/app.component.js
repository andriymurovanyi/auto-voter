import { defineComponent } from '../deps/vue';
import { Vueginate } from '../deps/vueginate';

import { AppTemplate } from './app.template.html';

import { timeAgo } from '../utils/date';
import { getPageData } from '../utils/pagination';

export const App = defineComponent({
  template: AppTemplate(),

  components: {
    Pagination: Vueginate,
  },

  data: () => ({
    search: '',

    pageLoading: true,

    statistics: [],

    pagination: {
      total: 0,
      currentPage: 1,
      perPage: 20,
    }
  }),

  computed: {
    filteredStatistics() {
      return this.statistics.filter((item) => {
        return (
          item.artist.toLowerCase().includes(this.search.toLowerCase()) ||
          item.song.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },

    lastSyncDate() {
      const [lastStatistics] = this.filteredStatistics;
      return timeAgo(lastStatistics.createdAt)
    },

    paginatedStatistics() {
      return getPageData({
        perPage: this.pagination.perPage,
        currentPage: this.pagination.currentPage,
        items: this.filteredStatistics,
      });
    },
  },

  async created() {
    await this.getStatistics();
  },

  async mounted() {
    await this.getStatistics();
    await this.$nextTick();
    this.finishPageLoading();
  },

  methods: {
    finishPageLoading() {
      document.body.classList.remove('page-loading');
      this.pageLoading = false;
    },

    onPageChange(page) {
      this.pagination.currentPage = page;
    },

    async getStatistics() {
      const { statistics } = await fetch('/api/statistics')
        .then((response) => response.json());

      this.statistics = statistics;
      this.pagination.total = statistics.length;
    },
  },
})