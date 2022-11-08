import {Cart} from './cart';
import {DeliveryInfo} from './delivery-info';
import {Merchant} from './merchant';
import {User} from './user';
import {Coupon} from './coupon';

export interface OrderDto {
  id?: number;
  cart?: Cart;
  createDate?: string;
  deliveryInfo?: DeliveryInfo;
  coupon?: Coupon;
  merchant?: Merchant;
  restaurantNote?: string;
  shippingNote?: string;
  user?: User;
  status?: number;

}
