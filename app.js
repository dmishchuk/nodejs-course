import { User, Product } from '../models';
import config from '../config/default';

const user = new User();
const product = new Product();

console.log(config.name, user, product);