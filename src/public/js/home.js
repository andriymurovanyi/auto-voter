import { createApp } from '/deps/vue';
import { App } from '/components/app.component';

const app = createApp({
  components: { App }
});

app.mount('#app');
