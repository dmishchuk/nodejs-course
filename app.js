import { User, Product } from './models';
import { DirWatcher, Importer } from './modules';
import config from './config/default';

const user = new User();
const product = new Product();
const importer = new Importer();
const dirWatcher = new DirWatcher('data', 5000);

console.log(config.name, user, product, dirWatcher, importer);