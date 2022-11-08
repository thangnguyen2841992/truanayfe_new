import {Merchant} from './merchant';
import {User} from './user';
import {Coupon} from './coupon';
import {DeliveryInfo} from './delivery-info';


export interface OrderResponse {
  id?: number;

  merchant?: Merchant;

  user?: User;

  createDate?: string;

  coupon?: Coupon;

  deliveryInfo?: DeliveryInfo;

  serviceFee?: number;

  shippingFee?: number;

  discountAmount?: number;

  totalFee?: number;

  restaurantNote?: string;

  shippingNote?: string;

  status?: number;

}
