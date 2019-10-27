import {Model} from '@vuex-orm/core'
import Show from "~/models/Show";

export default class Episode extends Model {
    static entity = 'Episode';

    static fields() {
        return {
            id: this.string(''),
            show_id: this.attr(null),
            title: this.string(''),
            description: this.string(''),
            is_downloaded: this.boolean(false),
            wasDownloadedOn: this.number(0),
            size: this.number(0),
            duration: this.number(0),
            progress: this.number(0),
            published_at: this.number(0),
            video_path: this.string(''),
            thumbnail_path: this.string(''),
            show: this.belongsTo(Show, 'show_id')
        }
    }
}