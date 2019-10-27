import { Database } from '@vuex-orm/core'
import Show from '~/models/Show'
import Episode from '~/models/Episode'

const database = new Database();

database.register(Show);
database.register(Episode);

export default database