import moment from "moment";

export default {
    data: function () {
        return {
            format: 'MMMM Do YYYY, hh:mm:ss'
        }
    },
    methods: {
        formatDate(date) {
            return moment.unix(date).format(this.format)
        },
        formatSec: (s) => (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
        //credit: https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds/37770048
    }
}