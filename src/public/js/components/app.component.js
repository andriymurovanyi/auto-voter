import { defineComponent } from '../deps/vue';
import { Vueginate } from '../deps/vueginate';

import { AppTemplate } from './app.template.html';
import { timeAgo } from '../utils/date';

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
      totalItems: 0,
      currentPage: 1,
      itemsPerPage: 20,
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

    async getStatistics() {
      const { statistics } = await fetch('/api/statistics')
        .then((response) => response.json());

      this.statistics = statistics;
    },
  },
})