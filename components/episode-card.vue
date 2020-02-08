<template>
  <div class="card">
    <div class="card-title">{{ episode.title }}</div>
    <div class="card-body">{{ episode.description }}</div>
    <div class="card-footerContainer">
      <div class="card-footer">
        <div class="secondary-text">{{ formatDate(episode.published_at) }}</div>
        <div class="progressContainer">
          <div class="progress">
            <div
              class="determinate"
              :style="{ width: this.determinateWidth }"
            ></div>
          </div>
        </div>
        <span class="episode-length secondary-text">{{
          formatSec(episode.duration)
        }}</span>
        <div class="button-area">
          <nuxt-link :to="'/watch?w=' + episode.id">
            <button>Watch</button>
          </nuxt-link>
          <button @click="stopDownload" v-if="this.isDownloading" key="stop">
            <span>{{ this.downloadProgress }}%</span>
          </button>
          <button
            @click="startDownload"
            v-else-if="!is_downloaded"
            key="download"
          >
            <font-awesome-icon icon="download" />
          </button>
          <button @click="deleteCache" v-else key="delete">
            <font-awesome-icon icon="trash-alt" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateFormatting from "~/mixins/dateFormattingMixin.js";
import Episode from "~/models/Episode";
import axios from "axios";

export default {
  name: "episode-card",
  props: ["episode"],
  data: function() {
    return {
      isDownloading: false,
      downloadProgress: 0
    };
  },
  mixins: [dateFormatting],
  computed: {
    determinateWidth: function() {
      return (this.episode.progress / this.episode.duration) * 100 + "%";
    }
  },
  asyncComputed: {
    is_downloaded: async function() {
      if (process.client)
        return (await caches.match(this.episode.video_path)) !== undefined;
    }
  },
  methods: {
    startDownload: async function() {
      this.isDownloading = true;
      this.downloadProgress = 0;

      if (navigator.storage && navigator.storage.persist) {
        await navigator.storage.persist();
      } else {
        return;
      }

      const url = String(this.episode.video_path);
      const CancelToken = axios.CancelToken.source();

      try {
        const videoRequest = axios.get(url, {
          responseType: "blob",
          onDownloadProgress: progressEvent => {
            this.downloadProgress = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
          cancelToken: CancelToken.token
        });
        this.cancelToken = CancelToken;
        const video = await videoRequest;

        const cache = await caches.open("video");
        const inMemoryResponse = new Response(video.data, {
          headers: video.headers
        });
        await cache.put(url, inMemoryResponse);
        this.isDownloading = false;

        Episode.update({
          where: this.episode.id,
          data: {
            wasDownloadedOn: this.$moment().format("X")
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    stopDownload: function() {
      this.downloadProgress = 0;
      this.isDownloading = false;
      this.cancelToken.cancel("download cancelled");
    },
    deleteCache: async function() {
      if (await caches.delete(this.episode.video_path)) {
        Episode.update({
          where: this.episode.id,
          data: {
            wasDownloadedOn: 0
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.card {
  padding: 1rem;
  box-sizing: border-box;
}

.card-title {
  color: var(--heading-color);
  font-size: 1.5rem;
  font-weight: 300;
}

.card-body {
  margin: 0.3rem 0 0.3rem;
}

.progress {
  width: 100%;
  background-color: var(--progress-background);
  height: 4px;
  border-radius: 2px;
  margin: 0.1rem 0 0.5rem 0;
}

.determinate {
  background-color: #26a69a;
  height: 4px;
}

.card-footerContainer {
  height: 5.5rem;
}

.card-footer {
  width: 92%;
  position: absolute;
  bottom: 1.5rem;
}

.button-area {
  display: flex;
  justify-content: center;
}

.button-area button {
  margin: 0 0.1rem;
}

.episode-length {
  position: absolute;
  right: 0;
}
</style>
