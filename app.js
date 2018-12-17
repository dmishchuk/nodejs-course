import { User, Product, DirWatcherthat, Importer } from './models';
import config from './config/default';

const user = new User();
const product = new Product();
const importer = new Importer();
const dirWatcher = new DirWatcherthat('data', 500);

console.log(config.name, user, product, dirWatcher, importer);