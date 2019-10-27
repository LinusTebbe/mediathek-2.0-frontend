import {Model} from '@vuex-orm/core'
import Episode from "~/models/Episode";

export default class Show extends Model {
    static entity = 'Show';

    static fields() {
        return {
            id: this.attr(null),
            thumbnail_path: this.attr(''),
            title: this.attr(''),
            description: this.attr(''),
            channel: this.attr(''),
            wantsPushNotifications: this.boolean(false),
            episodes: this.hasMany(Episode, 'show_id')
        }
    }
}
